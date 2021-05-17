const knex = require('knex')
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const { app, epLogin } = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('Login', () => {
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

  describe(`GET ${epLogin}`, () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers,
      )
    )

    const requiredFields = ['username', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      }
      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

    it(`responds 400 'invalid username or password' when bad username`, () => {
      const userInvalidUser = { username: 'user-not', password: 'existy' }
      return supertest(app)
        .post('/login')
        .send(userInvalidUser)
        .expect(400, { error: `User not found` })
    })

    it(`responds 400 'invalid username or password' when bad password`, () => {
      const userInvalidPass = { username: testUser.username, password: 'incorrect' }
      return supertest(app)
        .post('/login')
        .send(userInvalidPass)
        .expect(400, { error: `Invalid password` })
    })
    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        username: testUser.username,
        password: 'password',
        hash: testUser.password
      }
      
      return supertest(app)
        .post('/login')
        .send(userValidCreds)
        .expect(200)
        .then((res) => {
          const expectedToken = jwt.sign(
            { user_id: testUser.id },
            config.JWT_SECRET,
            {
              subject: testUser.username,
              expiresIn: config.JWT_EXPIRY,
              algorithm: 'HS256',
            }
          )
          expect(res.body.authToken).to.equal(expectedToken)
        })
    })
  })
})