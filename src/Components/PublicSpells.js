import React, { useEffect, useState } from 'react';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';

export default function PublicSpells(props) {
  // console.log("From index: ", props);

  const [spells, setSpells] = useState([])
  
  useEffect(() => {
    // console.log(spells);
    SpellsApiService.getPublicSpells()
      .then(spells => setSpells(spells))
      
  }, [])
  // console.log(spells);

  return (
    <>
      <Title>Public Spells</Title>
      <Spellbook spells={spells}/>
    </>
  );
}
