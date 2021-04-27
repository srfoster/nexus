
//TODO: Fix n+1 query problem
let attachTagsToSpells = async(db, spells) => {
    for(let i = 0; i < spells.length; i++){
      delete spells[i].is_deleted
      
      let tags = await db('tags')
        .where({spell_id: spells[i].id})
        .orderBy(`name`, 'asc')

      spells[i].tags = tags
    }
  return spells
}

// TODO: Tests for this
let checkIfLocked = async(db, req, res) => {
  let idList = req.params.id.split(',')
  console.log(idList);

  let lockedCount = await db('spells')
    .count('id')
    .where({locked: true})
    .andWhere('id', 'in', idList)

  console.log(lockedCount);
  if(lockedCount > 0) {return res.status(401).send({error: "You cannot alter a locked spell. Fork it instead."})}
}

module.exports = {
  attachTagsToSpells,
  checkIfLocked
}