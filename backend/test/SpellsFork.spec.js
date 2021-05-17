const knex = require('knex')
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const { app, epSpellsFork } = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('Spells Fork', () => {
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

  describe(`POST ${epSpellsFork}`, () => {
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

    it(`responds 200 if user is logged`, () => {
      return supertest(app)
      .post("/spells/4/fork")
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
    })

    it(`responds 401 if user is not logged`, () => {
      return supertest(app)
      .post("/spells/4/fork")
      .expect(401)
    })

    it(`creates a new spell, with the given spell's information`, () => {
      // const spellCount = testUsers[0].spells.length
      const spellCount = testSpells
        .map(spell => spell.user_id === testUsers[0].id ? spell.id : '')
        .filter(spells => spells)
        .length

      return supertest(app)
      .post("/spells/4/fork")
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then((res) => {
        db
        .from('spells')
        .select('*')
        .where({ user_id: testUsers[0].id })
        .then(rows => {
          expect(rows.length).to.equal(spellCount + 1)
        })

      })
    })

    it(`does not fork a private spell unless owned by that user`, () => {
      return supertest(app)
      .post("/spells/3/fork")
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(401)
    })
  })
})