const knex = require('knex')
const { DATABASE_URL, DATABASE_URL_QUERY } = require('../config')

// docker exec -it backend npm run print:downloads
//TODO: Selection choice (download ID vs all download info vs individual)


const db = knex({
  client: 'pg',
  connection: DATABASE_URL+DATABASE_URL_QUERY,
})

db('downloads')
.returning('*')
.then((downloads) => {
  console.log(downloads)
})