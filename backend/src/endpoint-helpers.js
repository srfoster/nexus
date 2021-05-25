
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

let sanitizeSortQuery = (startingSortQuery, sortQuery) => {
  // Should all sorts take the name as a secondary sort by default?
  let insecureSortQuery = startingSortQuery 

  // These are front end table column names
  let whiteListColumnNames = ['modified', 'created', 'name', 'description', 'public']
  if(insecureSortQuery && whiteListColumnNames.indexOf(insecureSortQuery) < 0){
    return res.status(400).send({error: "Not an expected sort column."})
  }
  sortQuery = insecureSortQuery

  // These are converting to back end table column names
  if(sortQuery === 'created') return sortQuery = 'date_created';
  if(sortQuery === 'modified') return sortQuery = 'date_modified';
  if(sortQuery === 'public') return sortQuery = 'is_public';

  return sortQuery;
}

let sanitizeSortDirection = (paramSortDirection, sortDirection) => {
  let insecure_sort_direction = paramSortDirection 

  if(insecure_sort_direction && ['asc', 'desc'].indexOf(insecure_sort_direction) < 0){
    return res.status(400).send({error: "Not an expected sort direction."})
  }

  return sortDirection = insecure_sort_direction
}

module.exports = {
  attachTagsToSpells,
  checkIfLocked,
  sanitizeSortQuery,
  sanitizeSortDirection,
  spellSearchFields,
  tagSearchFields
}