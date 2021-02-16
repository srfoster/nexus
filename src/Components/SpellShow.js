import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import TokenService from '../Services/token-service';
import config from '../config';
import {UnControlled as CodeMirror} from 'react-codemirror2'

function SpellShow(props) {
  const [spell, setSpell] = useState()

  useEffect(() => {
    const { id } = props.match.params

    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
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
      .then(spell => setSpell(spell))
  }, [])

  let debounceTimer

  const debounce = (func, delay) => { 
    clearTimeout(debounceTimer) 
    debounceTimer = setTimeout(() => func(), delay) 
  }  

  const handleNewCode = (codeMirrorValue) => {
    const { id } = props.match.params
    // console.log(codeMirrorValue);

    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify({
        text: codeMirrorValue
      })
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  }

  return (
    <>
      {/* {JSON.stringify(spell)} */}
      <h2>{spell ? spell.name : ''}</h2><br/>
      {spell ? spell.description : ''}
      <div className='CodeMirror'>
        <CodeMirror
          value={(spell) ? spell.text : ''}
          options={{
            mode: 'scheme',
            theme: 'material',
            lineNumbers: true
          }}
          onChange={(editor, data, value) => debounce(() => handleNewCode(value), 3000)}
        />
      </div>
    </>
  )
}

export default SpellShow;