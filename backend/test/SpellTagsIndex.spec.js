const knex = require('knex')
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const { app, epSpellTagsIndex } = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('Spell Tags Index', () => {
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

  describe(`GET ${epSpellTagsIndex}`, () => {
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

    it(`responds 200 if user is logged in and sends back tag data`, () => {
      return supertest(app)
      .get(`/spells/${testSpells[0].id}/tags`)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then((res) => {
        expect(res.body.length).to.be.greaterThan(0)
      })
    })

    it(`responds 401 if user is not logged in`, () => {
      return supertest(app)
      .get(`/spells/${testSpells[0].id}/tags`)
      .expect(401)
    })
  })

})