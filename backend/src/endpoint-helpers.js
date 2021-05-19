
let spellSearchFields = "LOWER(name || id || description) like LOWER(?)"
let tagSearchFields = "LOWER(name) like LOWER(?)"

//TODO: Fix n+1 query problem
let attachTagsToSpells = async(db, spells, searchTerm) => {
  // searchTerm = searchTerm ? searchTerm : `%%`;

  for(let i = 0; i < spells.length; i++){
    delete spells[i].is_deleted
    
    let tags = await db('tags')
      .where({spell_id: spells[i].id})
      // .whereRaw("LOWER(name) like LOWER(?)", [searchTerm])
      .orderBy(`name`, 'asc')

    spells[i].tags = tags
  }

  return spells
}

// TODO: Tests for this
let checkIfLocked = async(db, req, res) => {
  let idList = req.params.id.split(',')

  let lockedCount = await db('spells')
    .count('id')
    .where({locked: true})
    .andWhere('id', 'in', idList)

  if(Number(lockedCount[0].count) > 0) {return res.status(401).send({error: "You cannot alter a locked spell. Fork it instead."})}
}

module.exports = {
  attachTagsToSpells,
  checkIfLocked,
  spellSearchFields,
  tagSearchFields
}