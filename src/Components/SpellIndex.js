import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import TokenService from '../Services/token-service';
import config from '../config';

function SpellIndex() {
  const [spells, setSpells] = useState([])
  
  useEffect(() => {
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
    <>
      <h1>My Spells</h1>
    {console.log(spells)}
      Total Spells: {spells.length} <br/>
      {/* {spells[0].name} */}
      {spells.sort((a,b) => a-b).map(spell => {
        return (
          <div>
            <Link to={`/spells/${spell.id}`}>{spell.name}</Link>
            {spell.description}
          </div>
        )
      })}
    </>
  )
}

export default SpellIndex;