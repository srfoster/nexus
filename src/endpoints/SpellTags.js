const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  await helpers.checkIfLocked(req.app.get('db'), req, res)

  let spells = await req.app.get('db')('spells')
    .count('id')
    .where({id: req.params.id, user_id: req.user.id})
  if (Number(spells[0].count) === 0) return res.status(401).send({error: "You can't add tags to a spell you don't own."})

  let tags = await req.app.get('db')('tags')
    .where({spell_id: req.params.id})

  for(let i=0; i<tags.length; i++){
    if (tags[0].name === req.params.tag) {
      return res.status(401).send({error: "Selected tag already exists for this spell."})
    }
  }

  await req.app.get('db')('tags')
  .insert({name: req.params.tag, spell_id: req.params.id})
  .returning('*')
  .then((tags) => {
    res.send(tags[0])
  })
}

const handleDelete = async (req, res) => {
  await helpers.checkIfLocked(req.app.get('db'), req, res)

  let spells = await req.app.get('db')('spells')
    .where({id: req.params.id, user_id: req.user.id})

  if (spells.length === 0){return res.sendStatus(401)}

  await req.app.get('db')('tags')
    .where({name: req.params.tag, spell_id: req.params.id})
    .delete({})
    .then((tags) => {
      res.send({tags})
    })
}

module.exports = {
  handleGet,
  handleDelete
}
