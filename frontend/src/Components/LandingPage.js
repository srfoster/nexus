import React, { useEffect, useState } from 'react';
import { Switch, Route, Link, useHistory } from "react-router-dom";
import {Helmet} from "react-helmet";
import Header from './Header';
import Button from '@material-ui/core/Button';
import useStyles from '../styles.js';

const LandingPage = (props) => {
  let history = useHistory();
  const classes = useStyles();

  // If user has an auth token, send them to dashboard
  if (props.isLoggedIn){
    history.push('/spells')
  }

  return (
    <>
      <Helmet>
        <title>CodeSpells Nexus</title>
        <meta name="description" content="Welcome to the Nexus! If you want to write and save spells that run on CodeSpells video games, you're in the right place." />
      </Helmet>
      {/* <Route
        path={'/'}
        component={Header}
      /> */}
      <div className={classes.landingDisplay}>
        <div>
          <h1>
            CodeSpells Spell Sharing
          </h1>
        </div>
        <div className={classes.landingIntro}>
          <p>
            Welcome to the CodeSpells Spell Sharing Server!
          </p>
          
          <p>
            Witches and wizards can use this Spell Sharing Server to save, organize, and share their favorite spells.
            Spells made public on this server can be executed on our <a href='https://www.twitch.tv/codespells'>live Twitch dev stream </a> 
              by typing <code>!!run &lt;spell-id&gt;</code>  into chat after spawning a mini with <code>!!mini</code>.
          </p>

          <p>
            To find a current list of functions that can be executed in the CodeSpells Twitch chat, 
              check out the documentation <a href='https://docs.racket-lang.org/codespells-live/index.html'>here</a>.
          </p>

          <p>
            The Spell Sharing Server is still under development. Bugs can be reported in the Github 
              repository <a href='https://github.com/srfoster/codespells-spell-sharing-front-end'>here</a>. 
           </p>
          <Link to='/signup' >
            <Button variant="contained" color="primary">
              Create Account
            </Button>
            {/* <button>Create Account</button> */}
          </Link>
        </div>
      </div>
    </>
  );
}

export default LandingPage;