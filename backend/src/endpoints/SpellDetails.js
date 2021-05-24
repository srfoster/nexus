const helpers = require('../endpoint-helpers')
const { requireAuth } = require('../middleware/jwt-auth')

const handleGet = (req, res) => {
  try{
    req.app.get('db')('spells')
    .where({id: req.params.id})
    .first()
    .then((displaySpell) => {
      if( !displaySpell || displaySpell.is_deleted === true) return res.status(400).send({error: "This spell does not exist."})
      delete displaySpell.is_deleted

      if(displaySpell.is_public === false && req.user.id !== displaySpell.user_id) {
        return res.status(400).send({error: "This is a private spell that you do not own."})
      }

      req.app.get('db')('tags')
      .where({spell_id: displaySpell.id})
      .then(tags => {
        displaySpell.tags = tags
        res.send(displaySpell)
      })
    })
  } catch (error) {
    console.log('Catch error: ', error);
    res.send({error: 'Uh oh. Something went wrong.'})
  }
}

const handleDelete = async (req, res) => {
  try{
    await helpers.checkIfLocked(req.app.get('db'), req, res)

    req.app.get('db')('spells')
      .where({user_id: req.user.id})
      .andWhere('id', 'in', req.params.id.split(','))
      .update({is_deleted: true, date_modified: new Date()}, ['id', 'user_id', 'text', 'name', 'description', 'is_deleted'])
      .then((spells) => {
        // console.log('Spells: ', spells);
        if(spells.length){
          res.send(spells[0])
        } else {
          // console.log('Inside else');
          res.status(401).send({error: 'This spell is not yours! Go away!'})
        }
      })
  } catch (error) {
    console.log('Catch error: ', error);
    res.send({error: 'Uh oh. Something went wrong.'})
  }
}

const handlePut = async (req, res, next) => {
  try{
    await helpers.checkIfLocked(req.app.get('db'), req, res)
    
    const { name, description, text, is_public } = req.body;

    req.app.get('db')('spells')
    .where({user_id: req.user.id, id: req.params.id})
    .update({name, description, text, is_public, date_modified: new Date()})
    .returning('*')
    .then((rows) => {
      let row = rows[0]
      if (row){
        req.app.get('db')('tags')
        .where({spell_id: row.id})
        .then(tags => {
          row.tags = tags
          res.send(row)
        })
      } else {
        res.status(401).send({error: "You don't own that!"})
      }
    })
  } catch (error) {
    console.log('Catch error: ', error);
    res.send({error: 'Uh oh. Something went wrong.'})
  }
}

module.exports = {
  handleGet,
  handleDelete,
  handlePut
}
