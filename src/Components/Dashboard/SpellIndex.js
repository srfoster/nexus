import React, { useEffect, useState } from 'react';
import { Switch, Route, Link, useHistory } from "react-router-dom";
import TokenService from '../../Services/token-service';
import config from '../../config';
import SpellChart from './SpellChart';
import Dashboard from './Dashboard';

function SpellIndex(props) {
  const [spells, setSpells] = useState([])
  let history = useHistory();
  
  useEffect(() => {
    // console.log(spells);
    // if(!TokenService.hasAuthToken()){history.push('/gallery')}
    return fetch(`${config.API_ENDPOINT}/spells`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => {
            // TODO: Check error message and act accordingly
            history.push('/gallery')
            // return Promise.reject(e)
          })
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