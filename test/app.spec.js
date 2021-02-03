const knex = require('knex')
const { expect } = require('chai')
const { app, epHome, epLogin, epSignup, epSpellIndex, epSpellView } = require('../src/app')
const helpers = require('./test-helpers')

/*
  start of front end to display data from /spells
  front end wireframe
*/
/*
  Integrate passport.js
*/

describe('App', () => {
  let db

  const {
    testUsers,
    testSpells,
  } = helpers.makeSpellFixtures()
  // const testUser = testUsers[0]

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

    it(`GET ${epSpellIndex} responds with 401 if not logged in`, () => {
      return supertest(app)
        .get(epSpellIndex)
        .expect(401)
    })
    // FIXME: Test should only return spells belonging to user
    it(`GET ${epSpellIndex} responds with 200 containing the logged in user's spells in the database`, () => {
      return supertest(app)
        .get(epSpellIndex)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          expect(res.body.length).to.equal(testSpells.filter((s) => s.user_id === testUsers[0].id).length)
        })
    })
  })

})