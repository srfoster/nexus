const knex = require('knex')
const { expect } = require('chai')
const { app, epHome, epLogin, epSignup, epSpellIndex, epSpellView } = require('../src/app')
const helpers = require('./test-helpers')

describe('App', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      // TODO: add test db
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  it(`GET ${epSpellIndex} responds with 200 containing the spells in the database`, () => {
    return supertest(app)
      .get(epSpellIndex)
      .expect(200)
      .then((res) => {
        expect(res.body.length).equal(1)
      })
  })

})