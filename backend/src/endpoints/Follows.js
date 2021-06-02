const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  console.log('backend', req.user.id)
  let userId = req.params.id === 'me' ? req.user.id : req.params.id;
  let follows = await req.app.get('db')('follows')
    .where({user_id: req.user.id})

  let is_following = Boolean(follows.find(f => f.follower_id === +userId))

  res.send({follows, is_following})
}

const handlePost = async (req, res) =>{
  let userId = req.user.id
  let following = req.query.following 

  let newFollow = await req.app.get('db')('follows')
    .insert({user_id: userId, follower_id: following, date_created: new Date(), date_modified: new Date()})
    .returning('*')
  console.log('userId', userId)
  console.log('following', following)
  res.send({newFollow})
} 

const handleDelete = async (req, res) => {
  let userId = req.user.id
  let following = req.query.following 
  console.log('delete userId', userId)
  console.log('delete following', following)
  await req.app.get('db')('follows')
    .where({user_id: userId, follower_id: following})
    .delete({})
    .then((follows) => {
      res.send({follows})
    })
}

module.exports = {
  handleGet,
  handlePost,
  handleDelete
}