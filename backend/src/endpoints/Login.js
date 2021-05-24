const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

function handleLogin(req, res) {
  try{
    if(!req.body.username){
      return res.status(400).send({error: `Missing 'username' in request body`})
    }
    if(!req.body.password){
      return res.status(400).send({error: `Missing 'password' in request body`})
    }

    req.app.get('db')('users')
      .where({username: req.body.username})
      .then(async (users) => {
        let user = users[0]
        if (!user){return res.status(400).send({error: "User not found"})}

        let passwordMatch = await bcrypt.compare(req.body.password, user.password)
        if (!passwordMatch){return res.status(400).send({error: "Invalid password"})}

        if (passwordMatch) {
          res.send({message: "Passwords match",
            authToken: jwt.sign({user_id: user.id}, config.JWT_SECRET, {
              subject: user.username,
              expiresIn: config.JWT_EXPIRY,
              algorithm: 'HS256',
            })
          })
        } else{
          res.send({error: "Passwords do not match"})
        }
      })
  } catch (error) {
    console.log(error);
    res.send({error: 'Uh oh. Something went wrong.'})
  }
}

module.exports = handleLogin