process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'

const { expect } = require('chai')
const supertest = require('supertest')

require('dotenv').config()

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
  || "postgresql://admin@localhost/spells-test"

global.expect = expect
global.supertest = supertest