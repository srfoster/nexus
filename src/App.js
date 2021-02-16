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
import SimpleAccordion from './Components/DemoAccordion'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
require('codemirror/mode/scheme/scheme');

function App() {
  const paper = outerPaper();

  return (
    <div className="App">
      <Route
        path={'/'}
        component={Header}
      />
      <div className={paper.root}>
      <Paper >
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
            component={SpellAccordionTest}
          />
        </Switch>
      </Paper>
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
