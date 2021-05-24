const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  try{
    let displaySpell = await req.app.get('db')('spells')
    .where({id: req.params.id})
    .first()

    if(displaySpell.is_deleted === true) res.send({error: 'This spell does not exist'})
    delete displaySpell.is_deleted

    if(displaySpell.is_public === false) res.send({error: 'This spell is private. Flag as public to call it.'})

    req.app.get('db')('tags')
    .where({spell_id: displaySpell.id})
    .then(tags => {
      displaySpell.tags = tags
      res.send(displaySpell)
    })
  } catch (error) {
    console.log(error);
    res.send({error: 'Uh oh. Something went wrong.'})
  }
}

module.exports = {
  handleGet
}
