const knex = require('knex')
const { DATABASE_URL, DATABASE_URL_QUERY } = require('../config')

// docker exec -it backend npm run delete:download

const prompt = require('prompt-sync')();

let badgeId, confirmation
badgeId = prompt('What badge ID do you want to permanently delete? ')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL+DATABASE_URL_QUERY,
})

if (badgeId) {
  db('badges')
    .where({ id: badgeId })
    .returning('*')
    .then((badges) => {
      console.log(badges)
      confirmation = prompt('Are you sure this is the badge you wish to delete? yes/no: ')
      if (confirmation === 'yes') {
        db('badges')
        .where({ id: badgeId })
        .delete()
        .then((badges) => {
          console.log("Success!")
        })
      } else {
        console.log('Ctrl C to exit')
      }
    })

}