import './App.css';
import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import AuthApiService from './Services/auth-api-service';
import TokenService from './Services/token-service'
import config from './config'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import LoginForm from './Components/LoginForm';
import SignupForm from './Components/SignupForm';
require('codemirror/mode/scheme/scheme');

const LandingPage = (props) => {
  return (
    <div className="landingDisplay">
      <div className="landingHeader">
        <h1>
          CodeSpells Spell Sharing
        </h1>
      </div>
      <section className="landingBody">

        <p className="introText">
          Introduction paragraph.
        </p>
        <Link to='/signup' >
          <button>Create Account</button>
        </Link>
      </section>
    </div>
  );
}

const Header = (props) => {
  const header = useStyles(headerStyle);

  const handleLoginClick = () => {
    const { history } = props
    history.push('/login')
  }
  const handleSignupClick = () => {
    const { history } = props
    history.push('/signup')
  }

  return (
    <div className={header.root}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={() => handleSignupClick()}>Create Account</Button>
          <Button color="inherit" onClick={() => handleLoginClick()}>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  )

  // <div className={classes.root}>
  //   <AppBar position="static">
  //     <Toolbar>
  //       <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
  //         <MenuIcon />
  //       </IconButton>
  //       <Typography variant="h6" className={classes.title}>
  //         News
  //       </Typography>
  //       <Button color="inherit">Login</Button>
  //     </Toolbar>
  //   </AppBar>
  // </div>

  // return props.isLoggedIn ? (
  //   <div className="header">
  //     <Link to='/hangar'>
  //       My Hangar
  //     </Link>
  //     {" | "}
  //     <Link to='/logout'>
  //       Logout
  //     </Link>
  //   </div>
  // ) : (
  //   <div className={header.root}>
  //     <Link to='/signup'>
  //       Create Account
  //     </Link>
  //     {" | "}
  //     <Link to='/login'>
  //       Login
  //     </Link>
  //   </div>
  // ) 
}

// Header.defaultProps = {
//   location: {},
//   history: {
//     push: () => {},
//   },
// }

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
    {console.log(spells)}
      Spells: {spells.length} <br/>
      {/* {spells[0].name} */}
      {spells.map(spell => {
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
      Inside of SpellShow Component
      {JSON.stringify(spell)}
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

function App() {
  // const forms = useStyles(FormStyle);
  return (
    <div className="App">
      {/* <header className="App_header">
        <Header />
      </header> */}
      <Route
        path={'/'}
        component={Header}
      />
      <Switch>
        <Route
          exact path={'/'}
          component={LandingPage}
        />
        <Route
          // className={forms.root}
          path={'/signup'}
          component={SignupForm}
        />
        <Route
          // className={forms.root}
          path={'/login'}
          component={LoginForm}
        />
        <Route
          path={'/spells/:id'}
          component={SpellShow}
        />
        <Route
          path={'/spells'}
          component={SpellIndex}
        />
      </Switch>
    </div>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const headerStyle = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default App;
