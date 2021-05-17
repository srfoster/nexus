const knex = require('knex')
const { app } = require('./app')
const { PORT, DATABASE_URL, DATABASE_URL_QUERY } = require('./config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL+DATABASE_URL_QUERY,
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
