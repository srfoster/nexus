const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const handleSignup = (req, res, next) => {
  try{
    if (!req.body.username){return res.status(400).send({error: `Missing 'username' in request body`})}
    if (!req.body.password){return res.status(400).send({error: `Missing 'password' in request body`})}

    req.app.get('db')('users')
      .where({username: req.body.username})
      .then(async (usersWithUsername) => {
        let { username, password } = req.body

        if (usersWithUsername.length !== 0){return res.status(400).send({error: "Username already taken"})}
        if (username.includes(' ')){return res.status(400).send({error: "Username must not contain spaces"})}

        if (password.length < 8){return res.status(400).send({error: 'Password must be longer than 7 characters'})}
        if (password.length > 72){return res.status(400).send({error: 'Password must be less than 73 characters'})}
        if (password[0] === ' ' || password[password.length-1] === ' '){return res.status(400).send({error: 'Password must not start or end with empty spaces'})}
        //if (!(/[A-Z]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}
        //if (!(/[a-z]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}
        //if (!(/[0-9]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}
        //if (!(/[!@#\$%\^\&*\)\(+=._-]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}

        let hashPassword = await bcrypt.hash(req.body.password, 12)
        req.app.get('db')
          .insert({username: req.body.username, password: hashPassword})
          .into('users')
          .returning('*')
          .then((users) => {
            let user = users[0]
            user.password = undefined;
            res.send({
              user: user,
              authToken: jwt.sign({ user_id: user.id }, config.JWT_SECRET, {
                subject: user.username,
                expiresIn: config.JWT_EXPIRY,
                algorithm: 'HS256',
              })
            })
          })
      })
  } catch (error) {
    console.log('Catch error: ', error);
    res.send({ error: 'Uh oh. Something went wrong.' })
  }
}

module.exports = handleSignup