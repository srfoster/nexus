const helpers = require('../endpoint-helpers')

const handleGet = (req, res) => {
  try{
    console.log("ID: ", req.params.id);
    req.app.get('db')('tags')
    .where({spell_id: req.params.id})
    .then((displayTags) => {
      res.send(displayTags)
    })
  } catch (error) {
    console.log('Catch error: ', error);
    res.send({error: 'Uh oh. Something went wrong.'})
  }
}

module.exports = {
  handleGet
}
