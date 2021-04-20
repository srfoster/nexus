const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  let page = req.query.page ? req.query.page : 1;
  let page_size = req.query.page_size ? req.query.page_size : 10;
  let searchTerm = req.query.search ? `%${req.query.search}%` : `%%`;

  // Should all sorts take the name as a secondary sort by default?
  let sortQuery = req.query.sort ? req.query.sort : 'name';
  let sort_direction = req.query.sortDirection ? req.query.sortDirection : 'asc';
  if(sortQuery === 'created') sortQuery = 'date_created';
  if(sortQuery === 'modified') sortQuery = 'date_modified';
  if(sortQuery === 'public') sortQuery = 'is_public';

  let totalSpells = await req.app.get('db')('spells')
    .count('id')
    .where({user_id: req.user.id, is_deleted: false})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])

  let spells = await req.app.get('db')('spells')
    .where({user_id: req.user.id, is_deleted: false})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])
    .limit(page_size)
    .offset(page_size * (page-1))
    .orderBy(`${sortQuery}`, sort_direction)

  spells = await helpers.attachTagsToSpells(req.app.get('db'), spells)
  res.send({spells, total: Number(totalSpells[0].count)})
}

const handlePost = (req, res, next) => {
  req.app.get('db')('spells')
  .insert({user_id: req.user.id, name: 'New Spell', description: 'Spell Description',
            text: '(displayln "Hello")', date_created: new Date(), date_modified: new Date()})
  .returning('*')
  .then((spells) => {
    res.send(spells[0])
  })
}

module.exports = {
  handleGet,
  handlePost
}
