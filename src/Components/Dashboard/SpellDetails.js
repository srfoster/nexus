import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import TokenService from '../../Services/token-service';
import config from '../../config';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import Title from './Title';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SpellDashboard from './SpellDashboard';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  margin: {
    margin: theme.spacing(1),
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
    // placeHolder = <CircularProgress />
    clearTimeout(debounceTimer) 
    debounceTimer = setTimeout(() => func(), delay) 
    
  }  

  const handleNewCode = (keyDestination, codeMirrorValue) => {
    const { id } = props.match.params
    // console.log(codeMirrorValue);

    let payload = {}
    payload[keyDestination] = codeMirrorValue;
    payload['column'] = keyDestination;

    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(payload)
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  }

  const handleNewText = (keyDestination, newText) => {
    const { id } = props.match.params

    console.log(newText);

    let payload = {}
    payload[keyDestination] = newText;
    payload['column'] = keyDestination;

    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(payload)
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
  
  let placeHolder = '';

  return (
    <SpellDashboard>
      <React.Fragment>
        <Title>
          {/* <TextField className={classes.margin}
            label="Name"
          /> */}
          {spell ? spell.name : ''}
        
        </Title>
        <Typography>
          {spell ?           
            <TextField className={classes.margin}
              label="Description"
              // variant="outlined" 
              // defaultValue='Test' 
              defaultValue={spell.description}
              fullWidth
              onChange={(event) => debounce(() => handleNewText('description', event.target.value), 3000)}
            /> : 
          'Empty'}
        </Typography>
        {placeHolder}
        <div className='CodeMirror'>
          <CodeMirror
            value={(spell) ? spell.text : ''}
            options={{
              mode: 'scheme',
              theme: 'material',
              lineNumbers: true
            }}
            onChange={(editor, data, value) => debounce(() => handleNewCode('text', value), 3000)}
          />
        </div>
      </React.Fragment>
    </SpellDashboard>
  );
}
