const knex = require('knex')
const { DATABASE_URL, DATABASE_URL_QUERY } = require('../config')

// docker exec -it backend npm run edit:download
// TODO: Robustify: choose which to edit
const prompt = require('prompt-sync')();

let downloadId, downloadName, downloadLink, downloadDescription, downloadThumnail
downloadId = prompt('What download ID do you want to edit? ')
// db('downloads')
// .where({id: downloadId})
// .returning('*')
//   .then((downloads) => {
//   console.log("Succcess!")
// })
downloadName = prompt('What is the name of the download? ');
downloadLink = prompt('What is the link of the download? ');
downloadDescription = prompt('What is the description of the download? ');
downloadThumnail = prompt('What is the Thumbnail of the download? ');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL+DATABASE_URL_QUERY,
})

db('downloads')
.where({id: downloadId})
.update({name: downloadName, link: downloadLink, description: downloadDescription,
          thumbnail: downloadThumnail, date_modified: new Date()})
.returning('*')
  .then((downloads) => {
  console.log("Succcess!")
})