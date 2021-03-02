import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import TokenService from '../../Services/token-service';
import config from '../../config';
import SpellChart from './SpellChart';
import Dashboard from './Dashboard';

function SpellIndex(props) {
  const [spells, setSpells] = useState([])
  
  useEffect(() => {
    // console.log(spells);

    return fetch(`${config.API_ENDPOINT}/spells`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
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