import './App.css';
import React, { useEffect, useState } from 'react';
import { Switch, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga'; import AuthApiService from './Services/auth-api-service';
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
require('codemirror/mode/scheme/scheme');

ReactGA.initialize('UA-197643998-1')
const browserHistory = createBrowserHistory()
browserHistory.listen((location, action) => {
  ReactGA.pageview(location.pathname + location.search)
})

function App() {
  const paper = outerPaper();

  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
    // Only running this to check if logged in
    SpellsApiService.getUserById('me')
      .then((user) => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
  }, [])

  return (
    <div className="App">
      <div >
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
            path={'/signup'}
            component={SignupForm}
          />
          <Route
            path={'/login'}
            component={LoginForm}
          />
          <Route
            path={'/spells/:id'}
            // component={SpellDetails}
            component={(props) => <Dashboard child={<SpellDetails/>} isLoggedIn={isLoggedIn}></Dashboard>}
          />
          <Route
            path={'/spells'}
            component={(props) => <SpellIndex isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></SpellIndex>}
          />
          <Route
            path={'/friends'}
            component={(props) => <Dashboard child={<div>Friends Coming Soon</div>}></Dashboard>}
          />
          <Route
            path={'/gallery'}
            component={(props) => <Dashboard child={<PublicSpells/>} isLoggedIn={isLoggedIn}></Dashboard>}
          />
          <Route
            path={'/wizards/:id'}
            component={(props) => <Dashboard child={<UserProfile match={props.match}/>}></Dashboard>}
          />
           <Route
            path={'/downloads'}
            component={(props) => <Dashboard child={<Downloads/>}></Dashboard>}
          />
          <Route
            path={'/docs/:page'}
            component={(props) => <Dashboard child={<Docs match={props.match} />}></Dashboard>}
	        />
          <Route
            path={'/docs'}
            component={(props) => <Dashboard child={<Docs match={{params: {page: "docs"}}} />}></Dashboard>}
          />
          <Route
            component={(props) => <Dashboard child={<NotFound/>}></Dashboard>}
          />
        </Switch>
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


