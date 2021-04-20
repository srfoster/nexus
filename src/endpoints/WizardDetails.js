const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  let userId = req.params.id === 'me' ? req.user.id : req.params.id;
  let page = req.query.page ? req.query.page : 1;
  let page_size = req.query.page_size ? req.query.page_size : 9;
  let searchTerm = req.query.search ? `%${req.query.search}%` : `%%`
  let sortQuery = req.query.sort ? req.query.sort : 'name'

  let totalSpells = await req.app.get('db')('spells')
    .count('id')
    .where({user_id: userId, is_deleted: false, is_public: true})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])

  let user = await req.app.get('db')('users')
    .where({id: userId})
    .first()

  let spells = await req.app.get('db')('spells')
    .where({user_id: userId, is_deleted: false, is_public: true})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])
    .limit(page_size)
    .offset(page_size * (page-1))
    .orderBy(`${sortQuery}`, 'asc')
  
  let userData = {...user, spells}
  // console.log(userData);

  spells = await helpers.attachTagsToSpells(req.app.get('db'), spells)
  delete userData.password
  res.send({...userData, total: Number(totalSpells[0].count)})
}

module.exports = {
  handleGet
}
