import React, { useState, useEffect } from 'react';
import {titleCase} from '../../Util.js';

const linkTo = (s,t) => <a href={"/docs/"+s}>{t}</a>

const topDocLink = linkTo("docs", "Back to Top")

const docPageContent = {
 docs: <>
        <p>Welcome to the Nexus! [Say more about what the Nexus is...]</p>
	<p>If it's your first time here, we recommend: {linkTo("getting started", "Getting Started")}</p>
        <p>There are two CodeSpells worlds in the Nexus right now.  You can read more about those here:</p>
        <ul>
          <li>{linkTo("orb world", "Orb World")}</li>
          <li>{linkTo("orb lab", "Orb Lab")}</li>
        </ul>
        <p>If you're just looking for the spell-crafting APIs, here they are: {linkTo("langs", "APIs")}</p>
        <p>Above all, CodeSpells is a community, and the Nexus is the hub we are building for ourselves.  Learn more about the people involved in the community here: {linkTo("people", "People")}.</p>
      </>,
 "orb world": <>{topDocLink}<p>Wanna know about the Orb World?</p></>,
 "orb lab": <>{topDocLink}<p>What is Orb Lab?  Many have asked.  Few know.</p></>,
 "langs": <>{topDocLink}<p>Here are the APIs...</p></>,
 "getting started": <>{topDocLink}<p>Gotta start somewhere!</p></>,
}

function Docs(props) {
  const [page, setPage] = useState("one moment")

  useEffect(() => {
    setPage(props.match.params.page)
  },[])
  
  return (
    <>
      <div style={{textAlign: "left"}}>
      <h1>{titleCase(page)}</h1>
      {docPageContent[page]}
      </div>
    </>
  );
}

export default Docs;