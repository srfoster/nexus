import './App.css';
import React from 'react';
import { Switch, Route } from "react-router-dom";
import LoginForm from './Components/LoginForm';
import SignupForm from './Components/SignupForm';
import LandingPage from './Components/LandingPage';
import Header from './Components/Header';
import SpellIndex from './Components/SpellIndex';
import SpellAccordionTest from './Components/SpellAccordionTest';
import SpellShow from './Components/SpellShow';
require('codemirror/mode/scheme/scheme');

function App() {
  return (
    <div className="App">
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
