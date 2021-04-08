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
// TODO: update this endpoint 
let epPublicSpellDetails = '/secret/:id'
let epPublicSpells = '/gallery'
let epWizardDetails = '/wizards/:id'
let epSpellsFork = '/spells/:id/fork'
let epSpellTags = '/spells/:id/tags/:tag'
let epSpellTagsIndex = '/spells/:id/tags'

//TODO: Move this to another file
//TODO: Fix n+1 query problem
let attachTagsToSpells =
  async(spells) => {
    for(let i = 0; i < spells.length; i++){
      delete spells[i].is_deleted
      
      let tags = await app.get('db')('tags')
        .where({spell_id: spells[i].id})
        .orderBy(`name`, 'asc')

      spells[i].tags = tags
    }
  return spells
}

// Retrieve spells on viewing Dashboard
// FIXME: add sort_direction variable based on the "sort_direction" query for ascending or descending
app.get(epSpellIndex, requireAuth, async (req, res) => {
  let page = req.query.page ? req.query.page : 1;
  let page_size = req.query.page_size ? req.query.page_size : 10;
  let searchTerm = req.query.search ? `%${req.query.search}%` : `%%`

  // Should all sorts take the name as a secondary sort by default?
  let sortQuery = req.query.sort ? req.query.sort : 'name'
  let sort_direction = req.query.sort_direction ? req.query.sort_direction : 'asc'

  let totalSpells = await req.app.get('db')('spells')
    .count('id')
    .where({user_id: req.user.id, is_deleted: false})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])

  let spells = await req.app.get('db')('spells')
    .where({user_id: req.user.id, is_deleted: false})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])
    .limit(page_size)
    .offset(page_size * (page-1))
    .orderBy(`${sortQuery}`, sort_direction)

  spells = await attachTagsToSpells(spells)
  res.send({spells, total: Number(totalSpells[0].count)})
})

// Retrieve all public spells
app.get(epPublicSpells, async (req, res) => {
  let page = req.query.page ? req.query.page : 1;
  let page_size = req.query.page_size ? req.query.page_size : 9;
  let searchTerm = req.query.search ? `%${req.query.search}%` : `%%`
  let sortQuery = req.query.sort ? req.query.sort : 'name'

  let totalSpells = await req.app.get('db')('spells')
    .count('id')
    .where({is_public: true, is_deleted: false})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])

  let spells = await req.app.get('db')('spells')
    .where({is_public: true, is_deleted: false})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])
    .limit(page_size)
    .offset(page_size * (page-1))
    .orderBy(`${sortQuery}`, 'asc')

  spells = await attachTagsToSpells(spells)
  res.send({spells, total: Number(totalSpells[0].count)})
})

// Retrieve specific spell information
app.get(`${epSpellDetails}`, requireAuth, (req, res) => {
  req.app.get('db')('spells')
  .where({user_id: req.user.id, id: req.params.id, is_deleted: false})
  .first()
  .then((displaySpell) => {
    // delete displaySpell.is_deleted
    // console.log(displaySpells[0]);

    req.app.get('db')('tags')
    .where({spell_id: displaySpell.id})
    .then(tags => {
      displaySpell.tags = tags
      res.send(displaySpell)
    })
  })
})

// Retrieve specific spell information if public
app.get(`${epPublicSpellDetails}`, (req, res) => {
  req.app.get('db')('spells')
  .where({id: req.params.id, is_public: true, is_deleted: false})
  .first()
  .then((displaySpell) => {
    // delete displaySpell.is_deleted
    console.log(displaySpell);

    // TODO: Send back message if undefined

    req.app.get('db')('tags')
    .where({spell_id: displaySpell.id})
    .then(tags => {
      displaySpell.tags = tags
      res.send(displaySpell)
    })
  })
})

// Retrieve specific user information
app.get(`${epWizardDetails}`, requireAuth, async (req, res) => {
  let userId = req.params.id === 'me' ? req.user.id : req.params.id;
  let page = req.query.page ? req.query.page : 1;
  let page_size = req.query.page_size ? req.query.page_size : 9;
  let searchTerm = req.query.search ? `%${req.query.search}%` : `%%`
  let sortQuery = req.query.sort ? req.query.sort : 'name'

  let totalSpells = await req.app.get('db')('spells')
    .count('id')
    .where({user_id: userId, is_deleted: false, is_public: true})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])

  let user = await req.app.get('db')('users')
    .where({id: userId})
    .first()

  let spells = await req.app.get('db')('spells')
    .where({user_id: userId, is_deleted: false, is_public: true})
    .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])
    .limit(page_size)
    .offset(page_size * (page-1))
    .orderBy(`${sortQuery}`, 'asc')
  
  let userData = {...user, spells}
  // console.log(userData);

  spells = await attachTagsToSpells(spells)
  delete userData.password
  res.send({...userData, total: Number(totalSpells[0].count)})
})

// Get all tags on specific spell
app.get(`${epSpellTagsIndex}`, requireAuth, (req, res) => {
  console.log("ID: ", req.params.id);
  req.app.get('db')('tags')
  .where({spell_id: req.params.id})
  .then((displayTags) => {
    // console.log(displayTags)
    res.send(displayTags)
  })
})

// Post new tag to specific spell
app.post(`${epSpellTags}`, requireAuth, async (req, res) => {
  let spells = await req.app.get('db')('spells')
    .count('id')
    .where({id: req.params.id, user_id: req.user.id})
  if (Number(spells[0].count) === 0) return res.status(401).send({error: "You can't add tags to a spell you don't own."})

  let tags = await req.app.get('db')('tags')
    .where({spell_id: req.params.id})

  for(let i=0; i<tags.length; i++){
    if (tags[0].name === req.params.tag) {
      return res.status(401).send({error: "Selected tag already exists for this spell."})
    }
  }

  await req.app.get('db')('tags')
  .insert({name: req.params.tag, spell_id: req.params.id})
  .returning('*')
  .then((tags) => {
    res.send(tags[0])
  })
})

// Delete a tag from a spell
app.delete(`${epSpellTags}`, requireAuth, async (req, res) => {
  let spells = await req.app.get('db')('spells')
    .where({id: req.params.id, user_id: req.user.id})

  if (spells.length === 0){return res.sendStatus(401)}

  await req.app.get('db')('tags')
    .where({name: req.params.tag, spell_id: req.params.id})
    .delete({})
    .then((tags) => {
      res.send({tags})
    })
})

// Flag spell as deleted and hide it from client
app.delete(`${epSpellDetails}`, requireAuth, (req, res) => {
  // console.log('Params: ', req.params);
  // console.log('User: ', req.user);
  req.app.get('db')('spells')
    .where({user_id: req.user.id}).andWhere('id', 'in', req.params.id.split(','))
    .update({is_deleted: true, date_modified: new Date()}, ['id', 'user_id', 'text', 'name', 'description', 'is_deleted'])
    .then((spells) => {
      // console.log('Spells: ', spells);
      if(spells.length){
        res.send(spells[0])
      } else {
        // console.log('Inside else');
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
      req.app.get('db')('tags')
      .where({spell_id: row.id})
      .then(tags => {
        row.tags = tags
        res.send(row)
      })
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
app.post(`${epSpellsFork}`, requireAuth, async (req, res, next) =>{
  // console.log("Req: ", req.spells);
  // let public = user_id === req.user.id ? is_public: true : is_public: false;

  // console.log(req.body)
  let displaySpell = await req.app.get('db')('spells')
  //FIXME: currently blocks all private spells, even if owned by that user
  .where({id: req.params.id, is_public: true})
  .first()

  if(displaySpell){
    const {name, description, text} = displaySpell
    // console.log(req.user.id)
    let newSpell = await req.app.get('db')('spells')
    .insert({user_id: req.user.id, name: name+' (Fork)', description: description,
              text: text, date_created: new Date(), date_modified: new Date()})
    .returning('*')

    let displayTags = await req.app.get('db')('tags')
    .where({spell_id: req.params.id})

    if (displayTags){
      for(let i=0;i<displayTags.length;i++){
        let newTags = await req.app.get('db')('tags')
        .insert({spell_id: newSpell[0].id, name: displayTags[i].name})
      }
      res.send(newSpell[0])
    }

  } else{
    res.status(401).send({error: 'That spell is private'})
  }

})


app.post(epLogin, (req, res) => {
  // console.log(req.header.SSL_STATUS);

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
      // console.log("Inside then");
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
  epSpellTagsIndex
}
