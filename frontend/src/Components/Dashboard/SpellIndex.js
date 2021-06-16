import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import SpellChart from './SpellChart';
import Dashboard from './Dashboard';
import SpellsApiService from '../../Services/spells-api-service';
import FabAddIcon from './FabAddIcon';
import {Helmet} from "react-helmet";

function SpellIndex(props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = React.useState('');
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [spells, setSpells] = useState([])
  const [totalSpells, setTotalSpells] = useState(0)

  let history = useHistory();
  
  useEffect(() => {
    let isMounted = true
    // SpellsApiService.getUserById('me')
    //   .then((user) => props.setIsLoggedIn(true))
    //   .catch(() => props.setIsLoggedIn(false))

    if(props.isLoggedIn){
      SpellsApiService.getSpellsByUser(history, currentPage, search, sortDirection, orderBy)
        .then(spells => {
          setSpells(spells.spells)
          setTotalSpells(spells.total)
        })
    }

    return () => {
      isMounted = false
    }
  }, [currentPage, search, sortDirection, orderBy, history])

  function createSpell(event) {
    SpellsApiService.postNewSpell()
      .then(spell => {
        setSpells([...spells, spell])
      })
    console.log(spells)
  }

  return (
    <>
      <Helmet>
        <title>Spells | CodeSpells Nexus</title>
        <meta name="description" content="Create and edit your spells. Spells that you make public can be cast inside of CodeSpells games." />
      </Helmet>
        <SpellChart
          setCurrentPage={setCurrentPage}
          setSearch={setSearch}
          setSortDirection={setSortDirection}
          sortDirection={sortDirection}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          spells={spells}
          setSpells={setSpells}
          createSpell={props.createSpell}
          totalSpells={totalSpells}
          onChange={(changedSpell) => props.setSpells(spells.map(spell => changedSpell.id === spell.id ? changedSpell : spell))}
          onDelete={(deletedSpellID) => props.setSpells(spells.filter(spell => spell.id !== deletedSpellID))}
          setRefresh={setRefresh}
          darkMode={props.darkMode}
        />
        <FabAddIcon
          spells={spells}
          setSpells={setSpells}
          clickIcon={createSpell}
        />
    </>
  )
}

export default SpellIndex;
