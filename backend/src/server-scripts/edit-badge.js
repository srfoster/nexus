const knex = require('knex')
const { DATABASE_URL, DATABASE_URL_QUERY } = require('../config')

// docker exec -it backend npm run edit:badge
// TODO: Robustify: choose which to edit
const prompt = require('prompt-sync')();

let badgedId, badgeName, badgeLink, badgeDescription
badgeId = prompt('What is the ID of the badge you wish to edit? ')
// db('downloads')
// .where({id: downloadId})
// .returning('*')
//   .then((downloads) => {
//   console.log("Succcess!")
// })
badgeName = prompt('What is the name of this badge? ');
badgeDescription = prompt('What is the description of this badge? ');
badgeLink = prompt('Link where badge can be acquired? ');
const db = knex({
  client: 'pg',
  connection: DATABASE_URL+DATABASE_URL_QUERY,
})

db('badges')
.where({id: badgeId})
.update({name: badgeName, link: badgeLink, description: badgeDescription,
          date_modified: new Date()})
.returning('*')
  .then((badges) => {
  console.log("Succcess!")
})