import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import TokenService from '../../Services/token-service';
import config from '../../config';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import Title from './Title';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SpellDashboard from './SpellDashboard';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function SpellDetails(props) {
  const classes = useStyles();
  let history = useHistory();

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

  function byName( a, b ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }

  return (
    <SpellDashboard>
      <React.Fragment>
        <Title>{spell ? spell.name : ''}</Title>
        <Typography>
          {spell ? spell.description : ''}
        </Typography>
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
      </React.Fragment>
    </SpellDashboard>
  );
}
