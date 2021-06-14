const knex = require('knex')
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const { app, epHome, epLogin, epSignup, epSpellIndex, epSpellDetails, epPublicSpells, epWizardDetails, epSpellsFork, epSpellTags, epSpellTagsIndex } = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('App', () => {
  let db

  let {
    testUsers,
    testSpells,
    testTags,
    testBadges,
  } = helpers.makeSpellFixtures()
  const testUser = testUsers[0]

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

  describe(`GET /check-ownership/:spell_id`, () => { 
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

    it(`GET /check-ownership/:spell_id responds with 401 if not authorized`, () => {
      return supertest(app)
        .get(`/check-ownership/3`)
        .expect(401)
    })

    it(`GET /check-ownership/:spell_id responds with 200 and false for spells the user doesn't own`, () => {
      return supertest(app)
        .get(`/check-ownership/3`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then(async (res) => {

          expect(res.body.userOwnsSpell).to.equal(false)
        })
    })

    it(`GET /check-ownership/:spell_id responds with 200 and true for spells the user owns`, () => {
      return supertest(app)
        .get(`/check-ownership/2`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then(async (res) => {

          expect(res.body.userOwnsSpell).to.equal(true)
        })
    })
  })

  describe(`GET /users/:id/badges`, () => { 
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
    beforeEach('insert badges', () =>
      helpers.seedBadges(
        db,
        testBadges,
      )
    )

    it(`responds with 200 and a list of badges`, () => {
      return supertest(app)
        .get(`/users/1/badges`)
        .expect(200)
        .then(async (res) => {

          expect(res.body.length).to.equal(testBadges.length)
          expect(res.body.map(badge => badge.id).toString()).to.equal(testBadges.map(badge => badge.id).toString())
        })
    })
  })

  describe.only(`POST /users/:id/badges/:badgeName`, () => { 
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
    beforeEach('insert badges', () =>
      helpers.seedBadges(
        db,
        testBadges,
      )
    )

    it(`POST responds with 401 if not authorized`, () => {
      return supertest(app)
        .post(`/users/1/badges/Badge_3`)
        .expect(401)
    })

    it(`POST responds with 200 and new badge if authorized`, () => {
      return supertest(app)
        .post(`/users/1/badges/Test Badge`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then(async (res) => {

          expect(res.body.name).to.equal('Test Badge')
          expect(res.body.id).to.equal(3)
        })
    })
  })

})
