const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  console.log('backend', req.user.id)
  let follows = await req.app.get('db')('follows')
  .where({user_id: req.user.id})
  
  res.send({follows})
}

module.exports = {
  handleGet
}