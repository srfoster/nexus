// const knex = require('knex')
// const { expect } = require('chai')
// const jwt = require('jsonwebtoken')
// const { app, epHome, epLogin, epSignup, epSpellIndex, epSpellDetails, epPublicSpells, epWizardDetails, epSpellsFork, epSpellTags, epSpellTagsIndex } = require('../src/app')
// const helpers = require('./test-helpers')
// const config = require('../src/config')
// const bcrypt = require('bcryptjs')
// const supertest = require('supertest')

// describe('App', () => {
//   let db

//   let {
//     testUsers,
//     testSpells,
//     testTags,
//   } = helpers.makeSpellFixtures()
//   const testUser = testUsers[0]

//   let byName = (a,b) => a.name < b.name ? -1 : 1;

//   before('make knex instance', () => {
//     db = knex({
//       client: 'pg',
//       connection: process.env.TEST_DATABASE_URL,
//     })
//     app.set('db', db)
//   })

//   after('disconnect from db', () => db.destroy())

//   before('cleanup', () => helpers.cleanTables(db))

//   afterEach('cleanup', () => helpers.cleanTables(db))


// })
