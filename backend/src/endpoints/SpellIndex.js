const helpers = require('../endpoint-helpers')
const knex = require('knex')


const handleGet = async (req, res) => {
  try{
    let page = req.query.page ? req.query.page : 1;
    let page_size = req.query.page_size ? req.query.page_size : 10;
    let searchTerm = req.query.search ? `%${req.query.search.toLowerCase()}%` : `%%`;
    let sortQuery;
    let sortDirection;

    if(req.query.sort){
      sortQuery = helpers.sanitizeSortQuery(req.query.sort, sortQuery);
    }

    if(req.query.sortDirection){
      sortDirection = helpers.sanitizeSortDirection(req.query.sortDirection, sortDirection);
    } else {
      if(req.query.sort){
        // If there's a sort but no sort direction, default to ascending
        sortDirection = 'asc'
      } else {
        // If there's neither a sort nor a sort direction, default to descending
        sortDirection = 'desc'
      }
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
        order by ${sortQuery ? sortQuery : 'date_modified'} ${sortDirection}`, 
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
