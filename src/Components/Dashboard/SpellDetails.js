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

let debounceTimer

export default function SpellDetails(props) {
  const classes = useStyles();
  let history = useHistory();

  const [spell, setSpell] = useState()
  const [isSaving, setIsSaving] = useState(false)

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

  const debounce = (func, delay) => { 
    setIsSaving(true);

    clearTimeout(debounceTimer) 
    debounceTimer = setTimeout(() => func(), delay) 
    
  }  

  const handleNewText = (spell) => {
    const { id } = props.match.params

    let payload = spell
    console.log(payload);

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
      .then(() => setIsSaving(false))
  }
  
  let placeHolder = '';

  return (
    <SpellDashboard>
      <React.Fragment>
        <Title>
          {spell ? 
          <TextField className={classes.margin}
            label="Name"
            defaultValue={spell.name}
            onChange={(event) => {
              console.log(event.target.value);
              setSpell({...spell, name: event.target.value})
              debounce(() => handleNewText({...spell, name: event.target.value}), 3000)
            }}
          /> : 
          'Empty'}
        </Title> 
        {/* {placeHolder} */}
        
        {isSaving ? <div className={classes.spinner}>
          <CircularProgress />
        </div> : ''}
        {/* <div className={classes.spinner}>
          <CircularProgress />
        </div> */}

        {spell ?           
        <TextField className={classes.margin}
          label="Description"
          // variant="outlined" 
          // defaultValue='Test' 
          defaultValue={spell.description}
          fullWidth
          onChange={(event) => {
            setSpell({...spell, description: event.target.value})
            debounce(() => handleNewText({...spell, description: event.target.value}), 3000)
          }}
        /> : 
        'Empty'}
        <div className='CodeMirror'>
          <CodeMirror
            value={(spell) ? spell.text : ''}
            options={{
              mode: 'scheme',
              theme: 'material',
              lineNumbers: true
            }}
            onChange={(editor, data, value) => {
              setSpell({...spell, text: value})
              debounce(() => handleNewText({...spell, text: value}), 3000)
            }}
          />
        </div>
      </React.Fragment>
    </SpellDashboard>
  );
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  margin: {
    margin: theme.spacing(1),
  },
  spinner: {
    display: 'flex',
    '& > * + *': {
      marginRight: theme.spacing(2),
    },
  },
}));
