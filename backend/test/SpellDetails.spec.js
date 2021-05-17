const knex = require('knex')
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const { app, epSpellDetails } = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('Spell Details', () => {
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

  describe(`GET ${epSpellDetails}`, () => {
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

    it(`GET ${epSpellDetails} responds with 200 if logged in and sends spell data`, () => {
      return supertest(app)
        .get(`/spells/${testSpells[0].id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          expect(res.body.id).to.equal(testSpells[0].id)
        })
    })

    it(`GET ${epSpellDetails} responds with 401 if not logged in`, () => {
      return supertest(app)
        .get(epSpellDetails)
        .expect(401)
    })

    it(`GET ${epSpellDetails} does not respond with data from any other spell`, () => {
      return supertest(app)
        .get(`/spells/${testSpells[0].id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          expect(res.body.id).to.deep.equal(testSpells[0].id)
          // expect(res.body.id.toString()).to.not.equal(/[1]/)
        })
    })

    it(`does not allow access to a spell the user does not own`, () => {
      return supertest(app)
        .get('/spells/3')
        .expect(401)
    })

    // it does not show the is_deleted section of the spell data
  })

  describe(`DELETE ${epSpellDetails}`, () => {
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

    it(`flags deleted spells as deleted if the user is logged in`, () => {
      return supertest(app)
        .delete('/spells/1')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          db
          .from('spells')
          .select('*')
          .where({ id: res.body.id })
          .first()
          .then(row => {
            expect(row.is_deleted).to.eql(true)
          })
        })
    })
    it(`responds 401 if not logged in`, () => {
      return supertest(app)
        .delete('/spells/1')
        .expect(401)
    })
    it(`responds 401 if trying to delete another user's spell`, () => {
      return supertest(app)
        .delete('/spells/3')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(401)
    })
  })

  describe(`PUT ${epSpellDetails}`, () => {
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

    it(`responds 200 and changes the spell data`, () => {
      return supertest(app)
      .put('/spells/1')
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .send({name: "Test Replacement"})
      .expect(200)
      .then((res) => {
        expect(res.body.name).to.equal("Test Replacement")
      })
    })

    it(`responds 401 if trying to alter another user's spell`, () => {
      return supertest(app)
        .put('/spells/3')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(401)
    })

  })

})