import './App.css';
import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import AuthApiService from './Services/auth-api-service';
import TokenService from './Services/token-service'
import config from './config'


const LoginForm = (props) => {
  const [error, setError] = useState(null);

  const handleSubmitJwtAuth = (e) => {
    e.preventDefault()

    const { username, password } = e.target;

    AuthApiService.postLogin({
      username: username.value,
      password: password.value,
    })
      .then(user => {
        // console.log("Existing user logging in");
        username.value = ''
        password.value = ''
        // props.onLoginSuccess()
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
        <form
          className="LoginForm"
          onSubmit={(e) => handleSubmitJwtAuth(e)}
        >
          <label htmlFor="userName">Username: </label><br/>
          <input className='username' type='text' required id='username'></input><br/>

          <label htmlFor="password">Password:</label><br/>
          <input className='password' type='password' required id='password'></input><br/>

          <input type="submit" value="Log In" className="formButton"/>
        </form>

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
        props.onSignupSuccess()
      })
      .catch(res => {
        setError(res.error);
      })
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

function SpellViewer() {
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
      Spells: {spells.length}
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
          path={'/spells'}
          component={SpellViewer}
        />
      </Switch>
    </div>
  );
}

export default App;
