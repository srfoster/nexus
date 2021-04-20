const helpers = require('../endpoint-helpers')

const handleGet = (req, res) => {
  req.app.get('db')('spells')
  .where({id: req.params.id, is_public: true, is_deleted: false})
  .first()
  .then((displaySpell) => {
    // delete displaySpell.is_deleted
    console.log(displaySpell);

    // TODO: Send back message if undefined

    req.app.get('db')('tags')
    .where({spell_id: displaySpell.id})
    .then(tags => {
      displaySpell.tags = tags
      res.send(displaySpell)
    })
  })
}

module.exports = {
  handleGet
}
