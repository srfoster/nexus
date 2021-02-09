require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { requireAuth } = require('./middleware/jwt-auth')
const jsonBodyParser = express.json()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(jsonBodyParser)

let epHome = '/'
let epLogin = '/login'
let epSignup = '/signup'
let epSpellIndex = '/spells'
let epSpellView = '/spells/:id'

app.get(epSpellIndex, requireAuth, (req, res) => {
  req.app.get('db')('spells')
    .where({user_id: req.user.id})
    .then((displaySpells) => {
        res.send(displaySpells)
    })
})

app.post(epLogin, (req, res) => {
  console.log("inside server endpoint");
  req.app.get('db')('users')
    .where({username: req.body.username})
    .then(async (users) => {
      console.log("inside .then");
      let user = users[0]
      if (!user){return res.send({message: "User not found"})}
      let passwordMatch = await bcrypt.compare(req.body.password, user.password)
      console.log(passwordMatch);
      if (passwordMatch) {
        res.send({message: "Passwords match", authToken: jwt.sign({user_id: user.id}, config.JWT_SECRET, {
          subject: user.username,
          expiresIn: config.JWT_EXPIRY,
          algorithm: 'HS256',
        })
      })
      } else{
        res.send({message: "Passwords do not match"})
      }
      console.log("User retrieved", users);
    })
})

app.post(epSignup, (req, res, next) => {
  req.app.get('db')('users')
    .where({username: req.body.username})
    .then(async (usersWithUsername) => {
      if (usersWithUsername.length !== 0){
        res.send({message: "Username is taken"})
        return;
      }
      let hashPassword = await bcrypt.hash(req.body.password, 12)
      req.app.get('db')
        .insert({username: req.body.username, password: hashPassword})
        .into('users')
        .returning('*')
        .then((user) => {
          res.send({message: "Account created successfully"})
        })
    })
})


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = { app, epHome, epLogin, epSignup, epSpellIndex, epSpellView }