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
let epFollows = '/follows/:id'

// Retrieve spells on viewing Dashboard
app.get(epSpellIndex, requireAuth, SpellIndex.handleGet)

// Retrieve all public spells
app.get(epPublicSpells, PublicSpells.handleGet)

// Retrieve specific spell information
app.get(`${epSpellDetails}`, requireAuth, SpellDetails.handleGet)

// Retrieve specific spell information if public
app.get(`${epPublicSpellDetails}`, PublicSpellDetails.handleGet)

// Retrieve specific user information
app.get(`${epWizardDetails}`, requireAuth, WizardDetails.handleGet)

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
app.get(`${epFollows}`,requireAuth, Follows.handleGet)

// creates new follow in join table
app.post(`${epFollows}`,requireAuth, Follows.handlePost)

// deletes follow in join table
app.delete(`${epFollows}`,requireAuth, Follows.handleDelete)

app.get(`/check-ownership/:spell_id`, requireAuth, (req, res) => {
  req.app.get('db')('spells')
    .where({user_id: req.user.id, id: req.params.spell_id, is_deleted: false})
    .first()
    .then((matchingSpell) => {
      delete matchingSpell.is_deleted

      let boolean = !!matchingSpell
      // console.log(!!matchingSpell);
      res.send({userOwnsSpell: boolean})
    })
})

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
