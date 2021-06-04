require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { requireAuth } = require('./middleware/jwt-auth')
const jsonBodyParser = express.json()
const helpers = require('./endpoint-helpers')
const handleLogin = require('./endpoints/Login')
const handleSignup = require('./endpoints/Signup')
const SpellIndex = require('./endpoints/SpellIndex')
const PublicSpells = require('./endpoints/PublicSpells')
const SpellDetails = require('./endpoints/SpellDetails')
const PublicSpellDetails = require('./endpoints/PublicSpellDetails')
const WizardDetails = require('./endpoints/WizardDetails')
const SpellTagsIndex = require('./endpoints/SpellTagsIndex')
const SpellTags = require('./endpoints/SpellTags')
const SpellsFork = require('./endpoints/SpellFork')
const Downloads = require('./endpoints/Downloads')
const Follows = require('./endpoints/Follows')
const badgeDataList = require('./badgeDataList')

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
let epDownloads = '/downloads'
let epFollows = '/users/:id/follows'

const requireAuthIfMe = (req, res, next) => {
  if(req.params.id === 'me'){
    requireAuth(req, res, next)
  } else {
    next()
  }
}

// Retrieve spells on viewing Dashboard
app.get(epSpellIndex, requireAuth, SpellIndex.handleGet)

// Retrieve all public spells
app.get(epPublicSpells, PublicSpells.handleGet)

// Retrieve specific spell information
app.get(`${epSpellDetails}`, requireAuth, SpellDetails.handleGet)

// Retrieve specific spell information if public
app.get(`${epPublicSpellDetails}`, PublicSpellDetails.handleGet)

// Retrieve specific user information
app.get(`${epWizardDetails}`, requireAuthIfMe, WizardDetails.handleGet)

// Get all tags on specific spell
app.get(`${epSpellTagsIndex}`, requireAuth, SpellTagsIndex.handleGet)

// Delete a tag from a spell
app.delete(`${epSpellTags}`, requireAuth, SpellTags.handleDelete)

// Flag spell as deleted and hide it from client
app.delete(`${epSpellDetails}`, requireAuth, SpellDetails.handleDelete)

// Update user changes to a specific spell's information
app.put(`${epSpellDetails}`, requireAuth, SpellDetails.handlePut)

// Post new tag to specific spell
app.post(`${epSpellTags}`, requireAuth, SpellTags.handleGet)

// Create a new spell with default values
app.post(`${epSpellIndex}`, requireAuth, SpellIndex.handlePost)

// Creates a new spell with the forked spell's information
app.post(`${epSpellsFork}`, requireAuth, SpellsFork.handlePost)

// Retreives download information
app.get(`${epDownloads}`, Downloads.handleGet)

// Retrieves follow info
app.get(`${epFollows}`, requireAuthIfMe, Follows.handleGet)

// creates new follow in join table
app.post(`${epFollows}`,requireAuth, Follows.handlePost)

// deletes follow in join table
app.delete(`${epFollows}`,requireAuth, Follows.handleDelete)

app.get(`/check-ownership/:spell_id`, requireAuth, (req, res) => {
  req.app.get('db')('spells')
    .where({id: req.params.spell_id})
    .first()
    .then((matchingSpell) => {
      if(!matchingSpell || matchingSpell.is_deleted === true) return res.status(404).send({error: "This spell could not be found."})

      delete matchingSpell.is_deleted

      if(matchingSpell.user_id === req.user.id) {
        let boolean = !!matchingSpell
        res.send({userOwnsSpell: boolean})
      } else {
        res.send({userOwnsSpell: false})
      }

    })
})
// addresses.filter(function(val) { return val !== null; }).join(", ")
// let badgeObject = badgeDataList.badgeDataList.map(object => {
//   return object.name === 'Getting-Started' ? object  : null
// }).filter(function(val) { return val !== null; })[0]

// console.log(badgeObject)

// badgeDataList.badgeDataList.map(object => console.log(object.name=== 'Getting-Started' ? object : ''))
const giveBadge = async (req, res) => {
  let userId = req.params.id === 'me' ? req.user.id : req.params.id;
  let badgeLink, badgeDescription

  //When/if we have admin roles, we can enhance the security logic here.
  if(req.user.id !== userId) {
    return res.status(403).send({error: "You can only give badges to yourself at this time."})
  }

  let repeatCheck = await req.app.get('db')('badges')
    .where({user_id: userId, name: req.params.badgeName})
  if (repeatCheck.length) return res.send({message: 'You already earned this badge!'})
  
  let badges = await req.app.get('db')('badges')
  .where({user_id: req.user.id})

  let badgeObject = badgeDataList.badgeDataList.map(object => {
    return object.name === req.params.badgeName ? object  : null
  }).filter(function(val) { return val !== null; })[0]

  badgeLink = badgeObject.link
  badgeDescription = badgeObject.description
  
  req.app.get('db')('badges')
    // .where({user_id: req.user.id, id: req.params.spell_id, is_deleted: false})
    .insert({user_id: req.user.id, name: req.params.badgeName, link: badgeLink, description: badgeDescription, date_created: new Date(), date_modified: new Date()})
    .returning('*')
    .then((badges) => {
      res.send(badges[0])
    })
}
app.post(`/users/:id/badges/:badgeName`, requireAuth, giveBadge)



const getBadges = async (req, res) => {
  let userId = req.params.id === 'me' ? req.user.id : req.params.id;
  if(Number.isNaN(Number(userId))){
    let user = await req.app.get('db')('users')
      .where({username: userId})
      .first()

    userId = user.id
  }

  req.app.get('db')('badges')
  .where({user_id: userId})
  .then((badges) => {
    res.send(badges)
  })
  }
app.get(`/users/:id/badges`, requireAuthIfMe, getBadges)


app.post(epLogin, handleLogin)

app.post(epSignup, handleSignup)

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
  epPublicSpellDetails,
  epPublicSpells,
  epWizardDetails,
  epSpellsFork,
  epSpellTags,
  epSpellTagsIndex,
  epDownloads,
  epFollows
}
