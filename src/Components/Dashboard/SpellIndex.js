import React, { useEffect, useState } from 'react';
import { Switch, Route, Link, useHistory } from "react-router-dom";
import TokenService from '../../Services/token-service';
import config from '../../config';
import SpellChart from './SpellChart';
import Dashboard from './Dashboard';
import SpellsApiService from '../../Services/spells-api-service';

function SpellIndex(props) {
  const [spells, setSpells] = useState([])
  let history = useHistory();
  
  useEffect(() => {
    SpellsApiService.getSpellsByUser(history)
      .then(spells => setSpells(spells))
  }, [])

  return (
    <Dashboard spells={spells} setSpells={setSpells}>
      <SpellChart 
        spells={spells} 
        // setSpells={setSpells}
        onChange={(changedSpell) => setSpells(spells.map(spell => changedSpell.id === spell.id ? changedSpell : spell))}
        onDelete={(deletedSpellID) => setSpells(spells.filter(spell => spell.id !== deletedSpellID))}
      />

    </Dashboard>

  )
}

export default SpellIndex;