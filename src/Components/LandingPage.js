import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import Header from './Header';


const LandingPage = (props) => {
  return (
    <>
      <Route
        path={'/'}
        component={Header}
      />
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
    </>
  );
}

export default LandingPage;