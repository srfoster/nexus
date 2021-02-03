require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { requireAuth } = require('./middleware/jwt-auth')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

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