import React, { useEffect, useState } from 'react';
import { Switch, Route, Link, useHistory } from "react-router-dom";
import TokenService from '../../Services/token-service';
import config from '../../config';
import SpellChart from './SpellChart';
import Dashboard from './Dashboard';
import SpellsApiService from '../../Services/spells-api-service';
import FabAddIcon from './FabAddIcon';

function SpellIndex(props) {
  const [spells, setSpells] = useState([])
  const [totalSpells, setTotalSpells] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = React.useState('');
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  let history = useHistory();

  useEffect(() => {
    SpellsApiService.getUserById('me')
      .then((user) => props.setIsLoggedIn(true))
      .catch(() => props.setIsLoggedIn(false))

    if(props.isLoggedIn){
      SpellsApiService.getSpellsByUser(history, currentPage, search, sortDirection, orderBy)
        .then(spells => {
          setSpells(spells.spells)
          setTotalSpells(spells.total)
        })
    }
  }, [currentPage, refresh, search, sortDirection, orderBy])

  function createSpell(event) {
    SpellsApiService.postNewSpell()
      .then(spell => {
        setSpells([...spells, spell])
      })
  }


  return (
    <Dashboard
      spells={spells}
      setSpells={setSpells}
      createSpell={createSpell}

      child={<SpellChart
        setCurrentPage={setCurrentPage}
        setSearch={setSearch}
        setSortDirection={setSortDirection}
        sortDirection={sortDirection}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        spells={spells}
        totalSpells={totalSpells}
        // setSpells={setSpells}
        onChange={(changedSpell) => setSpells(spells.map(spell => changedSpell.id === spell.id ? changedSpell : spell))}
        onDelete={(deletedSpellID) => setSpells(spells.filter(spell => spell.id !== deletedSpellID))}
        setRefresh={setRefresh}
      />}
      fabIcon={<FabAddIcon
        spells={spells}
        setSpells={setSpells}
        clickIcon={createSpell}
      />}
    >

    </Dashboard>

  )
}

export default SpellIndex;
