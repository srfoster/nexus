const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  try{
    let page = req.query.page ? req.query.page : 1;
    let page_size = req.query.page_size ? req.query.page_size : 9;
    let searchTerm = req.query.search ? `%${req.query.search.toLowerCase()}%` : `%%`
    let sortQuery = req.query.sort ? req.query.sort : 'date_modified'

    let totalSpells = await req.app.get('db')
      .raw(`
        select count(id) from
        (select * from (select spells.*, users.username as author, string_agg(tags.name, ',') as tags from spells 
        left join tags on spells.id = tags.spell_id 
        left join users on users.id = spells.user_id
        where spells.is_deleted = false and spells.is_public = true
        group by spells.id, users.username) as spellsWithTags
        where lower(name) like ? or lower(description) like ? or lower(tags) like ? or id::text like ? or lower(author) like ?) as searchedSpells`, 
        ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%']
      )

    let spells = await req.app.get('db')
      .raw(`
        (select * from (select spells.*, users.username as author, string_agg(tags.name, ',') as tags from spells 
        left join tags on spells.id = tags.spell_id 
        left join users on users.id = spells.user_id
        where spells.is_deleted = false and spells.is_public = true
        group by spells.id, users.username) as spellsWithTags
        where lower(name) like ? or lower(description) like ? or lower(tags) like ? or id::text like ? or lower(author) like ?
        limit ? offset ?)
        order by date_modified desc`, 
        ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%',
          page_size, (page_size * (page-1))
        ]
      )
    
    // TODO: Does this return is_deleted flags?
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

module.exports = {
  handleGet
}
