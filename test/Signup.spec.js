const knex = require('knex')
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const { app, epSignup } = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('Signup', () => {
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

  describe(`GET ${epSignup}`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['username', 'password']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'testUsername',
          password: 'test password',
        }
        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/signup')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })

        it(`responds 400 'Password must be longer than 7 characters' when empty password`, () => {
          const userShortPassword = {
            username: 'testUsername',
            password: '1234567',
          }
          return supertest(app)
            .post('/signup')
            .send(userShortPassword)
            .expect(400, { error: `Password must be longer than 7 characters` })
        })

        it(`responds 400 'Password must be less than 73 characters' when long password`, () => {
          const userLongPassword = {
            username: 'testUsername',
            password: '*'.repeat(73),
          }
          return supertest(app)
            .post('/signup')
            .send(userLongPassword)
            .expect(400, { error: `Password must be less than 73 characters` })
        })

        it(`responds 400 error when password starts with spaces`, () => {
          const userPasswordStartsSpaces = {
            username: 'testUsername',
            password: ' 1Aa!2Bb@',
          }
          return supertest(app)
            .post('/signup')
            .send(userPasswordStartsSpaces)
            .expect(400, { error: `Password must not start or end with empty spaces` })
        })

        it(`responds 400 error when password ends with spaces`, () => {
          const userPasswordEndsSpaces = {
            username: 'testUsername',
            password: '1Aa!2Bb@ ',
          }
          return supertest(app)
            .post('/signup')
            .send(userPasswordEndsSpaces)
            .expect(400, { error: `Password must not start or end with empty spaces` })
        })

        it(`responds 400 error when password isn't complex enough`, () => {
          const userPasswordNotComplex = {
            username: 'testUsername',
            password: '11AAaabb',
          }
          return supertest(app)
            .post('/signup')
            .send(userPasswordNotComplex)
            .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
        })

        it(`responds 400 'User name already taken' when username isn't unique`, () => {
          const duplicateUser = {
            username: testUser.username,
            password: '11AAaa!!',
          }
          return supertest(app)
            .post('/signup')
            .send(duplicateUser)
            .expect(400, { error: `Username already taken` })
        })
      })

      it(`responds 400 error when username contains spaces`, () => {
        const usernameContainsSpaces = {
          username: 'Test Username',
          password: '1Aa!2Bb@',
        }
        return supertest(app)
          .post('/signup')
          .send(usernameContainsSpaces)
          .expect(400, { error: `Username must not contain spaces` })
      })

      context(`Happy path`, () => {
        it(`responds 201, serialized user, storing bcryped password`, () => {
          const newUser = {
            username: 'testUsername',
            password: '11AAaa!!!',
          }
          return supertest(app)
            .post('/signup')
            .send(newUser)
            .expect(200)
            .expect(res => {
              expect(res.body).to.have.property('id')
              expect(res.body.username).to.eql(newUser.username)
              expect(res.body).to.not.have.property('password')
              // expect(res.headers.location).to.eql(`/signup/${res.body.id}`)
              // const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
              // const actualDate = new Date(res.body.date_created).toLocaleString()
              // expect(actualDate).to.eql(expectedDate)
            })
            .expect(res =>
              db
                .from('users')
                .select('*')
                .where({ id: res.body.id })
                .first()
                .then(row => {
                  expect(row.username).to.eql(newUser.username)
                  // const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                  // const actualDate = new Date(row.date_created).toLocaleString()
                  // expect(actualDate).to.eql(expectedDate)

                  return bcrypt.compare(newUser.password, row.password)
                })
                .then(compareMatch => {
                  expect(compareMatch).to.be.true
                })
            )
        })
      })
    })
  })
})