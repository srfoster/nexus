import './App.css';
import React, { useEffect, useState } from 'react';
import { Switch, Route } from "react-router-dom";
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
require('codemirror/mode/scheme/scheme');

function App() {
  const paper = outerPaper();

  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  useEffect(() => {
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
          {/* <Route
            path={'/check-auth'}
            component={(props) => <Dashboard child={<UserProfile match={props.match}/>}></Dashboard>}
          /> */}
          <Route
            path={'/wizards/:username'}
            component={(props) => <Dashboard child={<UserProfile match={props.match}/>}></Dashboard>}
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
