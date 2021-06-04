const helpers = require('../endpoint-helpers')

const handleGet = async (req, res) => {
  let userId = req.params.id === 'me' ? req.user.id : req.params.id;
  if(Number.isNaN(Number(userId))){
    let user = await req.app.get('db')('users')
      .where({username: userId})
      .first()

    userId = user.id
  }
  
  let page = req.query.page ? req.query.page : 1;
  let page_size = req.query.page_size ? req.query.page_size : 10;
  let totalFollows = await req.app.get('db')('follows')
    .where({user_id: req.user.id})
    .count()

  let follows = await req.app.get('db')('follows')
    .where({user_id: req.user.id})
    .limit(10)
    .offset((page - 1) * page_size)
  let is_following = Boolean(follows.find(f => f.follower_id === +userId))

  

  res.send({total: Number(totalFollows[0].count), follows, is_following})
}

const handlePost = async (req, res) =>{
  let userId = req.user.id
  let following = req.query.following 

  let newFollow = await req.app.get('db')('follows')
    .insert({user_id: userId, follower_id: following, date_created: new Date(), date_modified: new Date()})
    .returning('*')
  res.send({newFollow})
}

const handleDelete = async (req, res) => {
  let userId = req.user.id
  let following = req.query.following 
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