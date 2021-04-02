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
  let history = useHistory();

  useEffect(() => {
    if(props.isLoggedIn){
      SpellsApiService.getSpellsByUser(history, currentPage)
        .then(spells => {
          setSpells(spells.spells)
          setTotalSpells(spells.total)
        })
    }
  }, [currentPage])

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
        spells={spells}
        totalSpells={totalSpells}
        // setSpells={setSpells}
        onChange={(changedSpell) => setSpells(spells.map(spell => changedSpell.id === spell.id ? changedSpell : spell))}
        onDelete={(deletedSpellID) => setSpells(spells.filter(spell => spell.id !== deletedSpellID))}
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
