import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import TokenService from '../../Services/token-service';
import config from '../../config';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import Title from './Title';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Dashboard from './Dashboard';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

let debounceTimer

export default function SpellDetails(props) {
  const classes = useStyles();
  let history = useHistory();

  const [spell, setSpell] = useState();
  const [isSaving, setIsSaving] = useState(false);

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
      .then(spell => {
        setSpell(spell)
        // setIsPublic(spell.is_public)
      })
  }, [])

  const debounce = (func, delay) => { 
    setIsSaving(true);

    clearTimeout(debounceTimer) 
    debounceTimer = setTimeout(() => func(), delay) 
    
  }  

  const updateSpell = (spell) => {
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
      .then((spell) => {
        setIsSaving(false)
        setSpell(spell)
      })
  }
  
  return (
    <Dashboard>
      {spell ? 
      <React.Fragment>
        <Title>
          {spell.name}
        </Title> 
        <TextField className={classes.title}
          label="Name"
          defaultValue={spell.name}
          onChange={(event) => {
            // console.log(event.target.value);
            setSpell({...spell, name: event.target.value})
            debounce(() => updateSpell({...spell, name: event.target.value}), 3000)
          }}
        />
          <IconButton aria-label="edit" onClick={() => {
            setSpell({...spell, is_public: !spell.is_public})
            debounce(() => updateSpell({...spell, is_public: !spell.is_public}), 3000)
          }}>
            {spell.is_public ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton> 
        
        <TextField className={classes.margin}
          label="Description"
          defaultValue={spell.description}
          fullWidth
          onChange={(event) => {
            setSpell({...spell, description: event.target.value})
            debounce(() => updateSpell({...spell, description: event.target.value}), 3000)
          }}
        />
        <div className='CodeMirror'>
          <CodeMirror
            value={spell.text}
            options={{
              mode: 'scheme',
              theme: 'material',
              lineNumbers: true
            }}
            onChange={(editor, data, value) => {
              setSpell({...spell, text: value})
              debounce(() => updateSpell({...spell, text: value}), 3000)
            }}
          />
        </div>
        {isSaving ? <div className={classes.spinner}>
          <CircularProgress size={30} />
        </div> : <p></p>}
      </React.Fragment>
      : <div>Spell is loading</div>}
    </Dashboard>
  );
}


const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  title: {
    margin: theme.spacing(1),
    width: '30%'
  },
  spinner: {
    display: 'flex',
    '& > * + *': {
      marginRight: theme.spacing(2),
    },
    // justifyContent: 'right',
  },
}));
