import React, { useEffect, useState } from 'react';
import { Switch, Route, Link, useHistory } from "react-router-dom";
import TokenService from '../Services/token-service';
import config from '../config';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
// import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
// import { mainListItems } from './listItems';
import SpellDetails from './Dashboard/SpellDetails';
import SpellDashboard from './Dashboard/SpellDashboard';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import Title from './Dashboard/Title';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function CreateSpell(props) {
  const classes = useStyles();
  let history = useHistory();

  const [spell, setSpell] = useState()

  const [nameText, setNameText] = useState('Empty')
  const [descText, setDescText] = useState('Empty')
  const [codeText, setCodeText] = useState('Empty')

  // useEffect(() => {
  //   return fetch(`${config.API_ENDPOINT}/create`, {
  //     method: 'GET',
  //     headers: {
  //       'content-type': 'application/json',
  //       'authorization': `bearer ${TokenService.getAuthToken()}`,
  //     },
      
  //   })
  //     .then(res =>
  //       (!res.ok)
  //         ? res.json().then(e => Promise.reject(e))
  //         : res.json()
  //     )
  // }, [])

  const handleCreateSpell = () => {

    // let payload = {}
    // payload[keyDestination] = newText;
    // payload['column'] = keyDestination;

    let payload = {
      'name': nameText,
      'description': descText,
      'text': codeText
    }

    return fetch(`${config.API_ENDPOINT}/create`, {
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
      // .then(
      //   history.push('/spells')
      // )
  }

  const testClick = (print) => {
    // console.log("Test: ", print)
    console.log("Click State", nameText, descText, codeText);
  }
  
  return (
    <SpellDashboard>
      <React.Fragment>
        <Title>
          <TextField className={classes.margin} id="Name"
            label="Name"
            // onChange={(event) => handleNewText('name', event.target.value)}
            onChange={(event) => setNameText(event.target.value)}
          />
        </Title>
        {/* <Button variant="contained" onClick={() => handleCreateSpell()}>Create Spell</Button> */}
        <Typography>
          <TextField className={classes.margin}
            label="Description"
            // variant="outlined" 
            // defaultValue='Test' 
            fullWidth
            // onChange={(event) => handleNewText('description', event.target.value)}
            onChange={(event) => setDescText(event.target.value)}
          />
        </Typography>
        <div className='CodeMirror'>
          <CodeMirror
            value={''}
            options={{
              mode: 'scheme',
              theme: 'material',
              lineNumbers: true
            }}
            // onChange={(editor, data, value) => handleNewText('text', value)}
            onChange={(editor, data, value) => setCodeText(value)}
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
}));