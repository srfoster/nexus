const helpers = require('../endpoint-helpers')
const knex = require('knex')


const handleGet = async (req, res) => {
  try{
    let page = req.query.page ? req.query.page : 1;
    let page_size = req.query.page_size ? req.query.page_size : 10;
    let searchTerm = req.query.search ? `%${req.query.search.toLowerCase()}%` : `%%`;
    let sortQuery;
    let sort_direction;

    // If sort value, resolve security risks
    // This value needs to go into an insecure order by clause later
    if(req.query.sort){
      // Should all sorts take the name as a secondary sort by default?
      let insecureSortQuery = req.query.sort 

      // These are front end table column names
      let whiteListColumnNames = ['modified', 'created', 'name', 'description', 'public']
      if(insecureSortQuery && whiteListColumnNames.indexOf(insecureSortQuery) < 0){
        return res.status(400).send({error: "Not an expected sort column."})
      }
      sortQuery = insecureSortQuery

      // These are converting to back end table column names
      if(sortQuery === 'created') sortQuery = 'date_created';
      if(sortQuery === 'modified') sortQuery = 'date_modified';
      if(sortQuery === 'public') sortQuery = 'is_public';

      let insecure_sort_direction = req.query.sortDirection 
      if(insecure_sort_direction && ['asc', 'desc'].indexOf(insecure_sort_direction) < 0){
        return res.status(400).send({error: "Not an expected sort direction."})
      }
      sort_direction = insecure_sort_direction
      // console.log(sort_direction);
    }

    let totalSpells = await req.app.get('db')
      .raw(`
        select count(id) from
        (select * from (select spells.*, users.username as author, string_agg(tags.name, ',') as tags from spells 
        left join tags on spells.id = tags.spell_id 
        left join users on users.id = spells.user_id
        where spells.user_id = ? and spells.is_deleted = false
        group by spells.id, users.username) as spellsWithTags
        where lower(name) like ? or lower(description) like ? or lower(tags) like ? or id::text like ?) as searchedSpells`, 
        [req.user.id, '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%']
      )

    let spells = await req.app.get('db')
      .raw(`
        (select * from (select spells.*, users.username as author, string_agg(tags.name, ',') as tags from spells 
        left join tags on spells.id = tags.spell_id 
        left join users on users.id = spells.user_id
        where spells.user_id = ? and spells.is_deleted = false
        group by spells.id, users.username) as spellsWithTags
        where lower(name) like ? or lower(description) like ? or lower(tags) like ? or id::text like ?
        limit ? offset ?)
        order by ${sortQuery ? sortQuery : 'date_modified'} ${sort_direction ? sort_direction : 'desc'}`, 
        [req.user.id, '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%',
          page_size, (page_size * (page-1))
        ]
      )
    
    spells = spells.rows
    spells = spells.map(spell => {
      spell.tags = spell.tags ? spell.tags.split(',') : []
      spell.tags = spell.tags.map(tag => {return {id: tag, name: tag}})
      return spell
    })

    res.send({spells, total: Number(totalSpells.rows[0].count)})

  } catch (error) {
    console.log('Catch error: ', error);
    res.send({error: 'Uh oh. Something went wrong.'})
  }
}

const handlePost = (req, res, next) => {
  try{
    let newTitle = req.query.title ? req.query.title : 'New Spell'

    req.app.get('db')('spells')
    .insert({user_id: req.user.id, name: newTitle, description: 'Spell Description',
              text: '(displayln "Hello")', date_created: new Date(), date_modified: new Date()})
    .returning('*')
    .then((spells) => {
      res.send(spells[0])
    })

  } catch (error) {
    console.log('Catch error: ', error);
    res.send({error: 'Uh oh. Something went wrong.'})
  }
}

module.exports = {
  handleGet,
  handlePost
}
