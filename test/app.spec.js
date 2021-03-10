const knex = require('knex')
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const { app, epHome, epLogin, epSignup, epSpellIndex, epSpellDetails, epPublicSpells, epWizardDetails } = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('App', () => {
  let db

  const {
    testUsers,
    testSpells,
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

  describe(`GET ${epSpellIndex}`, () => {
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
    it(`GET ${epSpellIndex} responds with 200 containing the logged in user's spells in the database`, () => {
      return supertest(app)
        .get(epSpellIndex)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          expect(res.body.length).to.equal(testSpells.filter((s) => s.user_id === testUsers[0].id).length)
        })
    })
    // It does not provide spells owned by another user
  })

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

    // This should also send back a list of spell tagged public
    it(`GET ${epPublicSpells} responds with 200`, () => {
      return supertest(app)
        .get(epPublicSpells)
        .expect(200)
    })

    // Callback for checking that no deleted flags are included
    // it.only(`does not show any spells with the deleted flag`, () => {
    //   return db('spells')
    //   .where({id: 1})
    //   .update({is_deleted: true, date_modified: new Date()}, ['id', 'user_id', 'text', 'name', 'description', 'is_deleted'])
    //   .then(rows => {
    //     console.log("Row: ", rows[0]);
    //     expect(rows[0].is_deleted).to.eql(true)

    //     return supertest(app)
    //     .get(epPublicSpells)
    //     .expect(200)
    //     .then((res) => {
    //       console.log("Res: ", res.body);
    //       expect(res.body.map(spell => spell.id)).to.not.include(1)
    //     })
    //   })
    // })

    // Async/await for checking no deleted flags are included
    it(`does not show any spells with the deleted flag`, async () => {
      await db('spells')
      .where({id: 1})
      .update({is_deleted: true, date_modified: new Date()}, ['id', 'user_id', 'text', 'name', 'description', 'is_deleted'])
      .then(rows => {
        console.log("Row: ", rows[0]);
        expect(rows[0].is_deleted).to.eql(true)
      })

      await supertest(app)
      .get(epPublicSpells)
      .expect(200)
      .then((res) => {
        console.log("Res: ", res.body);
        expect(res.body.map(spell => spell.id)).to.not.include(1)
      })
    })

    // It does not show any spells with the private flag

  })

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

    // should also send back spell information
    it(`GET ${epSpellDetails} responds with 200 if logged in`, () => {
      return supertest(app)
        .get('/spells/1')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
    })

    it(`GET ${epSpellDetails} responds with 401 if not logged in`, () => {
      return supertest(app)
        .get(epSpellDetails)
        .expect(401)
    })

    // It only provides the details of the selected spell

    it(`does not allow access to a spell the user does not own`, () => {
      return supertest(app)
        .get('/spells/3')
        .expect(401)
    })
  })

  describe(`GET ${epWizardDetails}`, () => {
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

    // TODO: Wizard profile should be publicly accessible 
    it(`GET ${epWizardDetails} responds with 401 if not logged in`, () => {
      return supertest(app)
        .get(epWizardDetails)
        .expect(401)
    })

    // should also send back wizard info
    it(`GET ${epWizardDetails} responds with 200 if logged in`, () => {
      return supertest(app)
        .get('/wizards/1')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
    })

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

    // should also respond with new spell data
    it(`responds 200 and changes the spell data`, () => {
      return supertest(app)
      .put('/spells/1')
      // .send({})
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then((res) => {
        expect(res.body)
      })
    })

    it(`responds 401 if trying to alter another user's spell`, () => {
      return supertest(app)
        .put('/spells/3')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(401)
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

    //FIXME: needs post data
    it(`responds 200 if user is logged in`, () => {
      return supertest(app)
      .post(epSpellIndex)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
    })
    // It only posts to the account of the current user
    // It does not post anything other than the default data

  })

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
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        config.JWT_SECRET,
        {
          subject: testUser.username,
          expiresIn: config.JWT_EXPIRY,
          algorithm: 'HS256',
        }
      )
      console.log("Created hash: ", userValidCreds.hash);
      console.log("Auto hash: ", expectedToken);
      return supertest(app)
        .post('/login')
        .send(userValidCreds)
        .expect(200, {
          message: 'Passwords match',
          authToken: expectedToken,
        })
    })
  })

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