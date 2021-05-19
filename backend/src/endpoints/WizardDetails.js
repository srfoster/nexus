const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {

// console.log(req.user.username)
// console.log(req.params.username)
// console.log(req.params.username === 'me')

  let userName = req.params.username === 'me' ? req.user.username : req.params.username;
  let page = req.query.page ? req.query.page : 1;
  let page_size = req.query.page_size ? req.query.page_size : 9;
  let searchTerm = req.query.search ? `%${req.query.search.toLowerCase()}%` : `%%`
  let sortQuery = req.query.sort ? req.query.sort : 'date_modified'

  // console.log(userName)

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
    .where({username: userName})
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
  
  let userData = {...user, spells}

  console.log('userdata',userData)

  delete userData.password
  res.send({...userData, total: Number(totalSpells.rows[0].count)})
}

module.exports = {
  handleGet
}
