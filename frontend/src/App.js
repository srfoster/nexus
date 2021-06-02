import './App.css';
import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory } from "react-router-dom";
import { createBrowserHistory } from 'history';
import {Helmet} from "react-helmet";
import AuthApiService from './Services/auth-api-service';
// import IdleService from './Services/idle-service';
import TokenService from './Services/token-service';
import LoginForm from './Components/LoginForm';
import SignupForm from './Components/SignupForm';
import LandingPage from './Components/LandingPage';
import SpellIndex from './Components/Dashboard/SpellIndex';
import { makeStyles } from '@material-ui/core/styles';
import SpellDetails from './Components/Dashboard/SpellDetails';
import Dashboard from './Components/Dashboard/Dashboard';
import PublicSpells from './Components/PublicSpells';
import UserProfile from './Components/UserProfile';
import NotFound from './Components/NotFound';
import SpellsApiService from './Services/spells-api-service';
import Downloads from './Components/Dashboard/Downloads';
import Docs from './Components/Docs/Docs';
import FabAddIcon from './Components/Dashboard/FabAddIcon';

require('codemirror/mode/scheme/scheme');


function App() {
  const paper = outerPaper();
  let history = useHistory();

  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  useEffect(() => {
    let isMounted = true
    // Only running this to check if logged in
    SpellsApiService.getUserById('me')
      .then((user) => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))

    return () => {
      isMounted = false
    }
  }, [])

  let path = window.location.pathname

  return ( 
    <div className="App">
      <Helmet>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-J6N2NMKYC9"></script>
        <script>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-J6N2NMKYC9');`}
        </script>
      </Helmet>
      <div >
        <Dashboard
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn}
          child={
            <Switch>
              <Route
                exact path={'/'}
                component={(props) => <LandingPage isLoggedIn={isLoggedIn}></LandingPage>}
              />
              <Route
                exact path={'/panel.html'}
                component={(props) => <LandingPage isLoggedIn={isLoggedIn}></LandingPage>}
              />
              <Route
                exact path={'/signup'}
                component={SignupForm}
              />
              <Route
                exact path={'/login'}
                component={LoginForm}
              />
              <Route
                path={'/spells/:id'}
                component={(props) => <SpellDetails/>}
              />
              <Route
                exact path={'/spells'}
                component={(props) => <SpellIndex isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
              />
              <Route
                exact path={'/friends'}
                component={(props) => <div>Friends Coming Soon</div>}
              />
              <Route
                exact path={'/gallery'}
                component={(props) => <PublicSpells/>}
              />
              <Route
                path={'/wizards/:id'}
                component={(props) => <UserProfile match={props.match}/>}
              />
              <Route
                path={'/docs/:page'}
                component={(props) => <Docs match={props.match} />}
              />
              <Route
                path={'/docs'}
                component={(props) => <Docs match={{params: {page: "docs"}}} />}
              />
              <Route
                exact path={'/downloads'}
                component={(props) => <Downloads/>}
              />
              <Route
                component={(props) => <NotFound/>}
              />
            </Switch>
          }
        >
        </Dashboard>
      </div>
    </div>
  );
}

const outerPaper = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(2),
      width: theme.spacing(50),
      height: theme.spacing(50),
    },
  },
}));

export default App;


