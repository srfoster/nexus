const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  let userId = req.params.id === 'me' ? req.user.id : req.params.id;
  let page = req.query.page ? req.query.page : 1;
  let page_size = req.query.page_size ? req.query.page_size : 9;
  let searchTerm = req.query.search ? `%${req.query.search}%` : `%%`
  let sortQuery = req.query.sort ? req.query.sort : 'date_modified'

  let totalSpells = await req.app.get('db')
    .raw(`
      select count(id) from
      (select * from (select spells.*, users.username as author, string_agg(tags.name, ',') as tags from spells 
      left join tags on spells.id = tags.spell_id 
      left join users on users.id = spells.user_id
      where spells.user_id = ? and spells.is_deleted = false and spells.is_public = true
      group by spells.id, users.username) as spellsWithTags
      where lower(name) like ? or lower(description) like ? or lower(tags) like ? or id::text like ?) as searchedSpells`, 
      [req.user.id, '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%']
    )

  let user = await req.app.get('db')('users')
    .where({id: userId})
    .first()

  let spells = await req.app.get('db')
    .raw(`
      (select * from (select spells.*, users.username as author, string_agg(tags.name, ',') as tags from spells 
      left join tags on spells.id = tags.spell_id 
      left join users on users.id = spells.user_id
      where spells.user_id = ? and spells.is_deleted = false and spells.is_public = true
      group by spells.id, users.username) as spellsWithTags
      where lower(name) like ? or lower(description) like ? or lower(tags) like ? or id::text like ?
      limit ? offset ?)
      order by date_modified desc`, 
      [userId, '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%',
        page_size, (page_size * (page-1))
      ]
    )

  spells = spells.rows
  spells = spells.map(spell => {
    spell.tags = spell.tags ? spell.tags.split(',') : []
    spell.tags = spell.tags.map(tag => {return {id: tag, name: tag}})
    return spell
  })
  
  let userData = {...user, spells}

  delete userData.password
  res.send({...userData, total: totalSpells.rows[0].count})
}

module.exports = {
  handleGet
}
