const knex = require('knex')
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const { app, epSpellIndex } = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('Spell Index', () => {
  let db

  let {
    testUsers,
    testSpells,
    testTags,
  } = helpers.makeSpellFixtures()
  const testUser = testUsers[0]

  let byName = (a,b) => a.name < b.name ? -1 : 1;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET ${epSpellIndex}`, () => {
    let page = 2;
    let page_size = 5;

    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    )
    beforeEach('insert spells', () =>
      helpers.seedSpells(
        db,
        testSpells,
      )
    )
    beforeEach('insert tags', () =>
      helpers.seedTags(
        db,
        testTags,
      )
    )

    it(`GET ${epSpellIndex} responds with 401 if not logged in`, () => {
      return supertest(app)
        .get(epSpellIndex)
        .expect(401)
    })

    it(`GET ${epSpellIndex} responds with 200 containing the logged in user's spells in the database`, () => {
      return supertest(app)
        .get(epSpellIndex)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          expect(res.body.total).to.equal(testSpells.filter((s) => s.user_id === testUsers[0].id && s.is_deleted === false).length)
          expect(res.body.spells.length).to.equal(10)
        })
    })

    it(`GET returns a list of tags that match the ID of each spell`, () => {
      return supertest(app)
        .get(epSpellIndex)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          for (let i=0; i<res.body.length; i++){
            if (res.body[i].tags.length){
              expect(res.body[i].tags.map((t) => t.id).toString())
              .to.equal(testTags.filter((t) => t.spell_id === testSpells[0].id).map(t => t.id).toString())
            } 
            expect(res.body[i].tags.length).to.equal(testTags.filter((t) => t.spell_id === testSpells[i].id).length)
          }
        })
    })

    it(`does not provide spells owned by another user`, () => {
      return supertest(app)
        .get(epSpellIndex)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          for (let i=0; i<page_size; i++){
            expect(res.body.spells[i].user_id).to.equal(testUsers[0].id)
          }
        })
    })

    it(`responds with the total number of matching spells`, () => {
      return supertest(app)
      .get(`/spells?page=2&page_size=5`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then(async (res) => {
        let userTotalSpells = testSpells.filter(spell => spell.user_id === 1 && spell.is_deleted === false).length

        expect(res.body.total).to.equal(userTotalSpells)
      })
    })

    // page and page_size defined at top of describe
    it(`responds with the page ${page} and ${page_size} results when given ?page=${page}&page_size=${page_size}`, () => {
      return supertest(app)
      .get(`/spells?page=${page}&page_size=${page_size}`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then(async (res) => {
        let allTestSpells = 
          await db
            .from('spells')
            .select('*')
            .where({user_id: testUsers[0].id, is_deleted: false})

        expect(res.body.spells.length).to.equal(page_size)
        expect(res.body.spells.map(spell => spell.id).toString())
          .to.equal(allTestSpells.sort(byName).map(spell => spell.id).slice(page_size * (page-1), page_size*page).toString())
      })
    })

    it(`only returns the first page with a size of 10 when no page or page size is specified`, () => {
      return supertest(app)
      .get(`/spells`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then(async (res) => {
        let allTestSpells = 
          await db
            .from('spells')
            .select('*')
            .where({user_id: testUsers[0].id, is_deleted: false})

        expect(res.body.spells.length).to.equal(10)
        expect(res.body.spells.map(spell => spell.id).toString())
          .to.equal(allTestSpells.sort(byName).map(spell => spell.id).slice(0, 10).toString())
      })
    })

    // TODO:
    // it responds with any matching spells when given search query
    // responds with "Apple Storm" spell when given search query ?search=apple
    // underscores within search queries should be translated to spaces
    
    it(`responds with the spell "Apple Storm" when given the query ?search=apple`, () => {
      return supertest(app)
      .get(`/spells?search=seeded`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then(async (res) => {
        let searchTerm = '%seeded%'
        
        let allSearchResults = 
          await db
            .from('spells')
            .select('*')
            .where({user_id: testUsers[0].id, is_deleted: false})
            .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])

        expect(res.body.spells[0].name).to.equal(allSearchResults[0].name)
        expect(res.body.total).to.equal(allSearchResults.length)
      })
    })

    let sortQuery = 'description'
    it(`responds with the spells sorted by ${sortQuery} when given ?sort=${sortQuery}`, () => {
      return supertest(app)
      .get(`/spells?sort=${sortQuery}`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then(async (res) => {
        let sortedSpells = 
          await db
            .from('spells')
            .select('*')
            .where({user_id: testUsers[0].id, is_deleted: false})
            .orderBy(`${sortQuery}`, 'asc')

        expect(res.body.spells[0].description.toString()).to.equal(sortedSpells[0].description.toString())
      })
    })
  })

  describe(`POST ${epSpellIndex}`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    )
    beforeEach('insert spells', () =>
      helpers.seedSpells(
        db,
        testSpells,
      )
    )

    it(`responds 200 if user is logged in and sends default spell data`, () => {
      return supertest(app)
      .post(epSpellIndex)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then((res) => {
        expect(res.body.name).to.equal("New Spell")
        expect(res.body.description).to.equal('Spell Description')
        expect(res.body.text).to.equal('(displayln "Hello")')
        expect(res.body.user_id).to.equal(testUsers[0].id)
      })
    })
  })
})