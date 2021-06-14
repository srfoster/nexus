const knex = require('knex')
const { DATABASE_URL, DATABASE_URL_QUERY } = require('../config')

// docker exec -it backend npm run add:badge

const prompt = require('prompt-sync')();

let badgeName, badgeLink, badgeDescription
badgeUserId = prompt('What is the ID of the user acquiring the badge?')
badgeName = prompt('What is the name of this badge? ');
badgeDescription = prompt('What is the description of this badge? ');
badgeLink = prompt('Link where badge can be acquired? ');
const db = knex({
  client: 'pg',
  connection: DATABASE_URL+DATABASE_URL_QUERY,
})

db('badges')
.insert({user_id: badgeUserId, name: badgeName, link: badgeLink, description: badgeDescription,
          date_created: new Date(), date_modified: new Date()})
.returning('*')
  .then((badges) => {
  console.log("Succcess!")
  console.log(badges)
})