const helpers = require('../endpoint-helpers')

const handlePost = async (req, res, next) =>{
  try{
    // let public = user_id === req.user.id ? is_public: true : is_public: false;

    let displaySpell = await req.app.get('db')('spells')
    .where({id: req.params.id})
    .first()

    if(displaySpell){
      const {name, description, text} = displaySpell

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
  } catch (error) {
    console.log('Catch error: ', error);
    res.send({error: 'Uh oh. Something went wrong.'})
  }
}

module.exports = {
  handlePost
}
