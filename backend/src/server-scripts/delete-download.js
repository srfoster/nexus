const knex = require('knex')
const { DATABASE_URL, DATABASE_URL_QUERY } = require('../config')

// docker exec -it backend npm run delete:download

const prompt = require('prompt-sync')();

let downloadId, confirmation
downloadId = prompt('What download ID do you want to permanently delete? ')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL+DATABASE_URL_QUERY,
})

if (downloadId) {
  db('downloads')
    .where({ id: downloadId })
    .returning('*')
    .then((downloads) => {
      console.log(downloads)
      confirmation = prompt('Are you sure this is the spell you wish to delete? yes/no: ')
      if (confirmation === 'yes') {
        db('downloads')
        .where({ id: downloadId })
        .delete()
        .then((downloads) => {
          console.log("Succcess!")
        })
      } else {
        return 'Ctrl C to exit'
      }
    })


}