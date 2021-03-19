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
// testing branches
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
let epSpellDetails = '/spells/:id'
let epPublicSpells = '/gallery'
let epWizardDetails = '/wizards/:id'
let epSpellsFork = '/spells/:id/fork'
let epSpellTags = '/spells/:id/tags/:tag'
let epSpellTagsIndex = '/spells/:id/tags'

// Retrieve spells on viewing Dashboard
app.get(epSpellIndex, requireAuth, (req, res) => {
  req.app.get('db')('spells')
    .where({user_id: req.user.id, is_deleted: false})
    .then((displaySpells) => {
        delete displaySpells[0].is_deleted
        res.send(displaySpells)

    })
})

// Retrieve all public spells
app.get(epPublicSpells, (req, res) => {
  req.app.get('db')('spells')
    .where({is_public: true, is_deleted: false})
    .then((displaySpells) => {
        res.send(displaySpells)
    })
})

// Retrieve specific spell information
app.get(`${epSpellDetails}`, requireAuth, (req, res) => {
  req.app.get('db')('spells')
  .where({user_id: req.user.id, id: req.params.id})
  .first()
  .then((displaySpell) => {
    delete displaySpell.is_deleted
    // console.log(displaySpells[0]);
    res.send(displaySpell)
  })
})

// Retrieve specific user information
app.get(`${epWizardDetails}`, requireAuth, (req, res) => {
  let userId = req.params.id === 'me' ? req.user.id : req.params.id;

  req.app.get('db')('users')
  .where({id: userId})
  .first()
  .then((user) => {
    delete user.password;

    req.app.get('db')('spells')
    .where({user_id: userId, is_deleted: false, is_public: true})
    .then((spells) => {
      res.send({...user, spells})
    })
  })
})

// Get all tags on specific spell
app.get(`${epSpellTagsIndex}`, requireAuth, (req, res) => {
  console.log("ID: ", req.params.id);
  req.app.get('db')('tags')
  .where({spell_id: req.params.id})
  .then((displayTags) => {
    res.send(displayTags)
  })
})

// Post new tag to specific spell
app.post(`${epSpellTags}`, requireAuth, (req, res) => {
  req.app.get('db')('tags')
  .insert({name: req.params.tag, spell_id: req.params.id})
  .returning('*')
  .then((tags) => {
    res.send(tags[0])
  })
})

// Delete a tag from a spell
app.delete(`${epSpellTags}`, requireAuth, (req, res) => {
  // req.app.get('db')('tags')
  //   .where({user_id: req.user.id, id: req.params.id})
  //   .delete({})
  //   .then((tags) => {
  //     res.send(tags)
  //   })
})

// Flag spell as deleted and hide it from client
app.delete(`${epSpellDetails}`, requireAuth, (req, res) => {
  console.log('Params: ', req.params);
  console.log('User: ', req.user);
  req.app.get('db')('spells')
    .where({user_id: req.user.id, id: req.params.id})
    .update({is_deleted: true, date_modified: new Date()}, ['id', 'user_id', 'text', 'name', 'description', 'is_deleted'])
    .then((spells) => {
      console.log('Spells: ', spells);
      if(spells.length){
        res.send(spells[0])
      } else {
        console.log('Inside else');
        res.status(401).send({error: 'Spell is not yours! Go away!'})
      }
    })
})

// Update user changes to a specific spell's information
app.put(`${epSpellDetails}`, requireAuth, (req, res, next) => {
  const { name, description, text, is_public } = req.body;

  req.app.get('db')('spells')
  .where({user_id: req.user.id, id: req.params.id})
  .update({name, description, text, is_public, date_modified: new Date()})
  .returning('*')
  .then((rows) => {
    let row = rows[0]
    if (row){
      res.send(row)
    } else {
      res.status(401).send({error: "You don't own that!"})
    }
  })
})

// Create a new spell with default values
app.post(`${epSpellIndex}`, requireAuth, (req, res, next) => {
  req.app.get('db')('spells')
  .insert({user_id: req.user.id, name: 'New Spell', description: 'Spell Description',
            text: '(displayln "Hello")', date_created: new Date(), date_modified: new Date()})
  .returning('*')
  .then((spells) => {
    res.send(spells[0])
  })
})

// Creates a new spell with the forked spell's information
app.post(`${epSpellsFork}`, requireAuth, (req, res, next) =>{
  // console.log("Req: ", req.spells);
  // let public = user_id === req.user.id ? is_public: true : is_public: false;

  req.app.get('db')('spells')
  //FIXME: currently blocks all private spells, even if owned by that user
  .where({id: req.params.id, is_public: true})
  .first()
  .then((displaySpell) => {
    if(displaySpell){
      const {name, description, text} = displaySpell
      req.app.get('db')('spells')
      .insert({user_id: req.user.id, name: name, description: description,
                text: text, date_created: new Date(), date_modified: new Date()})
      .returning('*')
      .then((spells) => {
        res.send(spells[0])
      })
    } else{
      res.status(401).send({error: 'That spell is private'})
    }
  })
})


app.post(epLogin, (req, res) => {
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
})

app.post(epSignup, (req, res, next) => {
  if (!req.body.username){return res.status(400).send({error: `Missing 'username' in request body`})}
  if (!req.body.password){return res.status(400).send({error: `Missing 'password' in request body`})}

  req.app.get('db')('users')
    .where({username: req.body.username})
    .then(async (usersWithUsername) => {
      console.log("Inside then");
      let { username, password } = req.body

      if (usersWithUsername.length !== 0){return res.status(400).send({error: "Username already taken"})}
      if (username.includes(' ')){return res.status(400).send({error: "Username must not contain spaces"})}

      if (password.length < 8){return res.status(400).send({error: 'Password must be longer than 7 characters'})}
      if (password.length > 72){return res.status(400).send({error: 'Password must be less than 73 characters'})}
      if (password[0] === ' ' || password[password.length-1] === ' '){return res.status(400).send({error: 'Password must not start or end with empty spaces'})}
      if (!(/[A-Z]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}
      if (!(/[a-z]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}
      if (!(/[0-9]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}
      if (!(/[!@#\$%\^\&*\)\(+=._-]/g).test(password)){return res.status(400).send({error: 'Password must contain one upper case, lower case, number and special character'})}

      let hashPassword = await bcrypt.hash(req.body.password, 12)
      req.app.get('db')
        .insert({username: req.body.username, password: hashPassword})
        .into('users')
        .returning('*')
        .then((users) => {
          users[0].password = undefined;
          res.send(users[0])
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

module.exports = {
  app,
  epHome,
  epLogin,
  epSignup,
  epSpellIndex,
  epSpellDetails,
  epPublicSpells,
  epWizardDetails,
  epSpellsFork,
  epSpellTags,
  epSpellTagsGet: epSpellTagsIndex
}
