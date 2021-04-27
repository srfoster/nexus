const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  let page = req.query.page ? req.query.page : 1;
  let page_size = req.query.page_size ? req.query.page_size : 9;
  let searchTerm = req.query.search ? `%${req.query.search}%` : `%%`
  let sortQuery = req.query.sort ? req.query.sort : 'date_modified'

  let totalSpells = await req.app.get('db')('spells')
    .count('id')
    .where({is_public: true, is_deleted: false})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])

  let spells = await req.app.get('db')('spells')
    .where({is_public: true, is_deleted: false})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])
    .limit(page_size)
    .offset(page_size * (page-1))
    .orderBy(`${sortQuery}`, 'desc')

  spells = await helpers.attachTagsToSpells(req.app.get('db'), spells)
  res.send({spells, total: Number(totalSpells[0].count)})
  // res.send({spells: [], total: 0})
}

module.exports = {
  handleGet
}
