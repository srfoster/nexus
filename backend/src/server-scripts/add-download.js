const knex = require('knex')
const { DATABASE_URL, DATABASE_URL_QUERY } = require('../config')

// docker exec -it backend npm run add:download

const prompt = require('prompt-sync')();

let downloadName, downloadLink, downloadDescription, downloadThumnail
downloadName = prompt('What is the name of the download? ');
downloadLink = prompt('What is the link of the download? ');
downloadDescription = prompt('What is the description of the download? ');
downloadThumnail = prompt('What is the Thumbnail of the download? ');
const db = knex({
  client: 'pg',
  connection: DATABASE_URL+DATABASE_URL_QUERY,
})

db('downloads')
.insert({name: downloadName, link: downloadLink, description: downloadDescription,
          thumbnail: downloadThumnail, date_created: new Date(), date_modified: new Date()})
.returning('*')
  .then((downloads) => {
  console.log("Succcess!")
  console.log(downloads)
})
