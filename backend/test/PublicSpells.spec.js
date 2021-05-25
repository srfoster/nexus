const knex = require('knex')
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const { app, epPublicSpells } = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('Public Spells', () => {
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

  // afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET ${epPublicSpells}`, () => {
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

    it(`GET ${epPublicSpells} responds with 200`, () => {
      return supertest(app)
        .get(epPublicSpells)
        .expect(200)
        .then(async (res) => {
          let byId = (a, b) => a-b

          expect(res.body.spells.length).to.equal(9)
          expect([2,6,7,8,9,10,11,12,13].toString())
            .to.equal(res.body.spells.map(spell => Number(spell.id)).sort(byId).toString())
        })
    })

    it(`does not show any spells with the deleted flag`, async () => {
      await db('spells')
      .where({id: 1})
      .update({is_deleted: true, date_modified: new Date()}, ['id', 'user_id', 'text', 'name', 'description', 'is_deleted'])
      .then(rows => {
        expect(rows[0].is_deleted).to.eql(true)
      })

      await supertest(app)
      .get(epPublicSpells)
      .expect(200)
      .then((res) => {
        expect(res.body.spells.map(spell => spell.id)).to.not.include(1)
      })
    })

    it(`only shows spells tagged as public`, async () => {
      await supertest(app)
      .get(epPublicSpells)
      .expect(200)
      .then((res) => {
        expect(res.body.spells.map(spell => spell.id)).to.not.include(1)
      })
    })

    it(`GET returns a list of tags that match the ID of each spell`, () => {
      return supertest(app)
        .get(epPublicSpells)
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

    it(`responds with the total number of matching spells`, () => {
      return supertest(app)
      .get(epPublicSpells)
      .expect(200)
      .then(async (res) => {
        let totalPublicSpells = testSpells.filter(spell => spell.is_public === true && spell.is_deleted === false).length

        expect(res.body.total).to.equal(totalPublicSpells)
      })
    })

    // Example /spells?page=2&page_size=5
    // For user[0], page 2 with a page size of 6 should return 6 spells
    let page = 2;
    let page_size = 6;
    it(`responds with the page ${page} and ${page_size} results when given ?page=${page}&page_size=${page_size}`, () => {
      return supertest(app)
      .get(`/gallery?page=${page}&page_size=${page_size}`)
      .expect(200)
      .then(async (res) => {

        expect(res.body.spells.length).to.equal(page_size)
        expect(res.body.spells.map(spell => spell.id).toString())
          .to.equal([11,12,13,14,15,16].toString())
      })
    })

    it(`only returns the first page with a size of 9 when no page or page size is specified`, () => {
      return supertest(app)
      .get(`/gallery`)
      .expect(200)
      .then(async (res) => {
        let allTestSpells = 
          await db
            .from('spells')
            .select('*')
            .where({is_public: true, is_deleted: false})

        expect(res.body.spells.length).to.equal(9)
        expect(res.body.spells.map(spell => spell.id).toString())
          .to.equal([2,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].slice(0, 9).toString())
      })
    })

    it(`responds with the spell "Cozy Cabin" when given the query ?search=cozy`, () => {
      return supertest(app)
      .get(`/gallery?search=cozy`)
      .expect(200)
      .then(async (res) => {
        let searchTerm = '%cozy%'
        
        let allSearchResults = 
          await db
            .from('spells')
            .select('*')
            .where({is_deleted: false, is_public: true})
            .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])

        expect(res.body.spells[0].name).to.equal(allSearchResults[0].name)
        expect(res.body.total).to.equal(allSearchResults.length)
      })
    })

    //4
    let sortQuery = 'description'
    it.skip(`responds with the spells sorted by ${sortQuery} when given ?sort=${sortQuery}`, () => {
      return supertest(app)
      .get(`/gallery?sort=${sortQuery}`)
      .expect(200)
      .then(async (res) => {
        let sortedSpells = 
          await db
            .from('spells')
            .select('*')
            .where({is_public: true, is_deleted: false})
            .orderBy(`${sortQuery}`, 'asc')

        expect(res.body.spells[0].description.toString()).to.equal(sortedSpells[0].description.toString())
      })
    })

    // for(let i=extraSpells[0].id; i<extraSpells.length + extraSpells[0].id; i++){
    //   console.log(i);
    //   testSpells = testSpells.filter(spell => spell.id !== i)
    // }
    // console.log(testSpells);

  })

})