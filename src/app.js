require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json());

// epStart = EndPointStart, this automatically changes the server test
const epStart = '/';
const startupGreet = 'Welcome aboard Captain, all systems online.';
app.get(epStart, (req, res) => {
  res.send(startupGreet)
})

app.get('/play', (req, res) => {
  req.app.get('db')('game_states')
    .where({})
    .then((gameStates) => {
      res.send({
        secretTarget: secret_target, 
        setTarget: target_word,
        lettersGuessed: letters_guessed,
      })
    })
})

app.post('/play', (req, res) => {
  console.log(req.body);
  req.app.get('db')('game_states')
  .where({})
  .then((gameStates) => {
    if(gameStates.length === 0){
      req.app.get('db')('game_states').insert({
        letters_guessed: JSON.stringify(req.body.lettersGuessed),
        secret_target: req.body.secretTarget,
        target_word: req.body.targetWord
      })
      .returning('*')
      .then(game_state => {
        res.send({message: "Message received"})
      })
    } else{
      req.app.get('db')('game_states').where({id: gameStates[0].id}).update({
        letters_guessed: JSON.stringify(req.body.lettersGuessed),
        secret_target: req.body.secretTarget,
        target_word: req.body.targetWord
      })
      .returning('*')
      .then(game_state => {
        res.send({message: "Message received"})
      })
    }

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

module.exports = { app, epStart, startupGreet }