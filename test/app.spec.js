const knex = require('knex')
const { expect } = require('chai')
const jwt = require('jsonwebtoken')
const { app, epHome, epLogin, epSignup, epSpellIndex, epSpellDetails, epPublicSpells, epWizardDetails, epSpellsFork, epSpellTags, epSpellTagsGet } = require('../src/app')
const helpers = require('./test-helpers')
const config = require('../src/config')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

describe('App', () => {
  let db

  const {
    testUsers,
    testSpells,
    testTags,
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
          console.log(res.body);
          expect(res.body.length).to.equal(testSpells.filter((s) => s.user_id === testUsers[0].id && s.is_deleted === false).length)
        })
    })

    it(`does not provide spells owned by another user`, () => {
      return supertest(app)
        .get(epSpellIndex)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          for (let i=0; i<res.body.length; i++){
            expect(res.body[i].user_id).to.equal(testUsers[0].id)
          }

        })
    })

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

    it(`GET ${epPublicSpells} responds with 200`, () => {
      return supertest(app)
        .get(epPublicSpells)
        .expect(200)
        .then((res) => {
          expect(JSON.stringify(res.body.map(spell => spell.id).sort((a,b) => a-b)))
            .to.equal(JSON.stringify(testSpells
              .map(spell => spell.is_public === true && spell.is_deleted === false ? spell.id : "")
              .filter(spell => spell !== "")
              .sort((a,b) => a-b)))
        })
    })

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

    it(`only shows spells tagged as public`, async () => {
      await supertest(app)
      .get(epPublicSpells)
      .expect(200)
      .then((res) => {
        console.log("Res: ", res.body);
        expect(res.body.map(spell => spell.id)).to.not.include(1)
      })
    })

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

    it(`GET ${epSpellDetails} responds with 200 if logged in and sends spell data`, () => {
      return supertest(app)
        .get(`/spells/${testSpells[0].id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          console.log(res.body);
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
          console.log(res.body);
          expect(res.body.id).to.deep.equal(testSpells[0].id)
          // expect(res.body.id.toString()).to.not.equal(/[1]/)
        })
    })

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

    it(`GET ${epWizardDetails} responds with 200 if logged in`, () => {
      return supertest(app)
        .get(`/wizards/${testUsers[0].id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200)
        .then((res) => {
          expect(res.body.id).to.deep.equal(testUsers[0].id)
        })
    })

  })

  describe.only(`GET ${epSpellTagsGet}`, () => {
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

    it.only(`responds 401 if user is not logged in`, () => {
      return supertest(app)
      .get(`/spells/${testSpells[0].id}/tags`)
      .expect(401)
    })
  })

  describe(`POST ${epSpellTags}`, () => {
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

    it(`responds 200 if user is logged in and sends back tag data`, async () => {
      let tagCount = 0
      await db
      .from('tags')
      .select('*')
      .where({ spell_id: 2 })
      .then(rows => {
        tagCount = rows.length
      })

      return supertest(app)
      .post('/spells/2/tags/fire_magic')
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then(async (res) => {
        await db
        .from('tags')
        .select('*')
        .where({ spell_id: 2 })
        .then(rows => {
          expect(rows.length).to.equal(tagCount + 1)
        })
      })
    })

    it(`responds 401 if user is not logged in`, () => {
      return supertest(app)
      .post('/spells/2/tags/fire_magic')
      .expect(401)
    })

    // only allows authorized tags?

  })

  // TODO:
  describe.skip(`DELETE ${epSpellTags}`, () => {
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

    it(`responds 401 if trying to delete another user's tag`, () => {
      return supertest(app)
        .delete('/spells/3')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(401)
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

    it(`responds 200 if user is logged in and sends default spell data`, () => {
      return supertest(app)
      .post(epSpellIndex)
      .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
      .expect(200)
      .then((res) => {
        // console.log("Res: ", res.body);
        expect(res.body.name).to.equal("New Spell")
        expect(res.body.description).to.equal('Spell Description')
        expect(res.body.text).to.equal('(displayln "Hello")')
        expect(res.body.user_id).to.equal(testUsers[0].id)
      })
    })

  })

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
        console.log("Spell Count: ", spellCount);
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
