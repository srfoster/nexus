import './App.css';
import React, { useEffect, useState } from 'react';
import { Switch, Route } from "react-router-dom";
import AuthApiService from './Services/auth-api-service';
import IdleService from './Services/idle-service';
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
require('codemirror/mode/scheme/scheme');

function App() {
  const paper = outerPaper();

  return (
    <div className="App">
      <div >
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
            component={SpellDetails}
          />
          <Route
            path={'/spells'}
            component={SpellIndex}
          />
          <Route
            path={'/friends'}
            component={(props) => <Dashboard><div>Friends Coming Soon</div></Dashboard>}
          />
          <Route
            path={'/gallery'}
            component={(props) => <Dashboard><PublicSpells /></Dashboard>}
          />

          <Route
            path={'/wizards/:id'}
            component={(props) => <Dashboard><UserProfile match={props.match}/></Dashboard>}
          />
          <Route
            component={NotFound}
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
