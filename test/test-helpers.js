const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  let password = 'password';
  return [
    {
      id: 1,
      username: 'test-user-1',
      password: '$2a$12$uhrv0LeV/d887GRNCERPU.Cs1azOmVCEk8cBWRIFUMVfRWq37DLX6',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      username: 'test-user-2',
      password: '$2a$12$uhrv0LeV/d887GRNCERPU.Cs1azOmVCEk8cBWRIFUMVfRWq37DLX6',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      username: 'test-user-3',
      password: '$2a$12$uhrv0LeV/d887GRNCERPU.Cs1azOmVCEk8cBWRIFUMVfRWq37DLX6',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      username: 'test-user-4',
      password: '$2a$12$uhrv0LeV/d887GRNCERPU.Cs1azOmVCEk8cBWRIFUMVfRWq37DLX6',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeSpellsArray() {
  let ret = [
    {
      id: 1,
      user_id: 1,
      name: 'Apple Storm',
      text: '(Hello World)',
      description: 'Swirling storm of apples',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      is_public: false,
      is_deleted: false,
    },
    {
      id: 2,
      user_id: 1,
      name: 'Cozy Cabin',
      text: '(Hello World)',
      description: 'Summons a log cabin',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      is_public: true,
      is_deleted: false,
    },
    {
      id: 3,
      user_id: 3,
      name: 'Fire ball',
      text: '(Hello World)',
      description: 'Burn the things',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      is_public: false,
      is_deleted: false,
    },
    {
      id: 4,
      user_id: 3,
      name: 'Teleport',
      text: '(Hello World)',
      description: 'Teleport places',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      is_public: true,
      is_deleted: true,
    },
    {
      id: 5,
      user_id: 1,
      name: 'Ice ball',
      text: '(Hello World)',
      description: "It's cold",
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      is_public: false,
      is_deleted: true,
    },
    {
      id: 6,
      user_id: 1,
      name: 'Sorting Test',
      text: '(Hello World)',
      description: "Alphabetical description",
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      is_public: true,
      is_deleted: false,
    }
  ]
  for(let i=1; i<15; i++){
    ret.push({
      id: ret.length + i,
      user_id: 1,
      // Zz's ensure these sort after all other spells
      name: 'Zz Seeded extra '+i,
      text: '(Hello Extra)',
      description: 'This is a bonus',
      is_deleted: false,
      is_public: true
    })
  }
  return ret;
}

// let extraSpells = []
// for(let i=1; i<15; i++){
//   extraSpells.push({
//     id: testSpells.length + i,
//     user_id: 1,
//     // Zz's ensure these sort after all other spells
//     name: 'Zz Seeded extra '+i,
//     text: '(Hello Extra)',
//     description: 'This is a bonus',
//     is_deleted: false,
//     is_public: true
//   })
// }
// testSpells = testSpells.concat(extraSpells)

function makeTagsArray() {
  return [
    {
      id: 1,
      spell_id: 1,
      name: 'fire_magic',
    },
    {
      id: 2,
      spell_id: 3,
      name: 'ice_magic',
    },
    {
      id: 3,
      spell_id: 1,
      name: 'earth_magic',
    },
  ]
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        users,
        spells,
        tags
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE spells_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE tags_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
        trx.raw(`SELECT setval('spells_id_seq', 0)`),
        trx.raw(`SELECT setval('tags_id_seq', 0)`),
      ])
    )
  )
}

function makeSpellFixtures() {
  const testUsers = makeUsersArray()
  const testSpells = makeSpellsArray()
  const testTags = makeTagsArray()
  return { testUsers, testSpells, testTags }
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    // password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedSpells(db, spells) {
  const preppedSpells = spells.map(spell => ({
    ...spell
  }))
  return db.into('spells').insert(preppedSpells)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('spells_id_seq', ?)`,
        [spells[spells.length - 1].id],
      )
    )
}

function seedTags(db, tags) {
  const preppedTags = tags.map(tag => ({
    ...tag
  }))
  return db.into('tags').insert(preppedTags)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('tags_id_seq', ?)`,
        [tags[tags.length - 1].id],
      )
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeSpellsArray,
  cleanTables,
  makeSpellFixtures,
  seedUsers,
  seedSpells,
  seedTags,
  makeAuthHeader
}
