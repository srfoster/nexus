const helpers = require('../endpoint-helpers')

const handleGet = (req, res) => {
  console.log("ID: ", req.params.id);
  req.app.get('db')('tags')
  .where({spell_id: req.params.id})
  .then((displayTags) => {
    // console.log(displayTags)
    res.send(displayTags)
  })
}

module.exports = {
  handleGet
}
