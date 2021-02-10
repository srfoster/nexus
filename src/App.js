import './App.css';
import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import AuthApiService from './Services/auth-api-service';
import TokenService from './Services/token-service'
import config from './config'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import Button from '@material-ui/core/Button';


const LoginForm = (props) => {
  let usernameInput = React.createRef()
  let passwordInput = React.createRef()

  const [error, setError] = useState(null);

  const handleSubmitJwtAuth = (e) => {
    e.preventDefault()

    // const { username, password } = e.target;
    console.log(usernameInput);
    AuthApiService.postLogin({
      username: usernameInput.current.value,
      password: passwordInput.current.value,
    })
      .then(user => {
        // console.log("Existing user logging in");
        usernameInput.current.value = ''
        passwordInput.current.value = ''
        // props.onLoginSuccess()
        handleLoginSuccess()
      })
      .catch(res => {
        setError(res.error);
      })
    }

    const handleLoginSuccess = () => {
      const { history } = props
      history.push('/spells')
      // if(props.onLogin){
      //   props.onLogin(true);
      // }
    }

    return (
    <>
      <div>
        {/* <form
          className="LoginForm"
          onSubmit={(e) => handleSubmitJwtAuth(e)}
        > */}
          <label htmlFor="userName">Username: </label><br/>
          <input className='username' type='text' required id='username' ref={usernameInput}></input><br/>

          <label htmlFor="password">Password:</label><br/>
          <input className='password' type='password' required id='password' ref={passwordInput}></input><br/>

          {/* <input type="submit" value="Log In" className="formButton"/> */}
        {/* </form> */}
        <Button variant="contained" color="primary" onClick={(e) => handleSubmitJwtAuth(e)}>
          Submit
        </Button>
      </div>
      <div role='alert'>
        {error ? <p className='red'>{error}</p> : null}
      </div>
    </>
  )
};

const SignupForm = (props) => {
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault()
    const { username, password, passwordVerify } = e.target;

    if(password.value !== passwordVerify.value){
      setError("Password do not match");
      return;
    }

    AuthApiService.postUser({
      username: username.value,
      password: password.value,
    })
      .then(user => {
        // console.log("New user submitted");
        username.value = ''
        password.value = ''
        passwordVerify.value = ''
        handleSignupSuccess()
      })
      .catch(res => {
        setError(res.error);
      })
    }
  
    const handleSignupSuccess = () => {
      const { history } = props
      history.push('/spells')
      // if(props.onLogin){
      //   props.onLogin(true);
      // }
    }

    return (
    <>
      <div>
        <form
          className="SignupForm"
          onSubmit={(e) => handleSubmit(e)}
        >
          <label htmlFor="userName">Username: </label><br/>
          <input className='username' type='text' required id='username'></input><br/>

          <label htmlFor="password">Password:</label><br/>
          <input className='password' type='password' required id='password'></input><br/>

          <label htmlFor="passwordVerify">Confirm Password:</label><br/>
          <input className='passwordVerify' type='password' required id='passwordVerify'></input><br/>

          <input type="submit" value="Sign Up" className="formButton"/>
        </form>

      </div>
      <div role='alert'>
        {error ? <p className='red'>{error}</p> : null}
      </div>
    </>
  )
}

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
  return props.isLoggedIn ? (
    <div className="header">
      <Link to='/hangar'>
        My Hangar
      </Link>
      {" | "}
      <Link to='/logout'>
        Logout
      </Link>
    </div>
  ) : (
    <div className="header">
      <Link to='/signup'>
        Create Account
      </Link>
      {" | "}
      <Link to='/login'>
        Login
      </Link>
    </div>
  ) 
}

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

  const handleNewCode = (codeMirrorValue) => {
    const { id } = props.match.params
    console.log(codeMirrorValue);

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
            mode: 'xml',
            theme: 'material',
            lineNumbers: true
          }}
          onChange={(editor, data, value) => handleNewCode(value)}
        />
      </div>
    </>
  )
}

function App() {
  return (
    <div className="App">
      <p/>
      <header className="App_header">
        <Header />
      </header>
      <Switch>
        <Route
          exact path={'/'}
          component={LandingPage}
        />
        <Route
          path={'/signup'}
          component={SignupForm}
        />
        <Route
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

export default App;
