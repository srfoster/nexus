import React, { useState, useEffect } from 'react';
import GettingStarted from './GettingStarted.js';
import {kabobCaseToTitleCase} from '../../Util.js';
import {linkTo, topDocLink} from './util.js';

const docPageContent = {
  docs: <>
        <p>Welcome to the Nexus!</p>
        <p>The Nexus is a hub for the CodeSpells community where we can write, save, share, and find spells that can be cast in game, 
          download CodeSpells authored works, and connect with other Mages.</p>
	      <p>If it's your first time here, we recommend beginning your journey in our {linkTo("getting-started", "Getting Started")} section.</p>
        <p>There are two CodeSpells worlds in the <a href="/downloads">Downloads</a> section right now.  You can read more about those here, as well as learn how to create your own CodeSpells authored works:</p>
        <ul>
          <li>{linkTo("orb-world", "Orb World")}</li>
          <li>{linkTo("orb-lab", "Orb Lab")}</li>
          <li>{linkTo("building-new-games", "Building New Games")}</li>
        </ul>
        <p>If you just want to write spells and you're looking for the spell-crafting APIs, you can find them here: {linkTo("langs", "APIs")}</p>
        <p>Above all, CodeSpells is a community, and the Nexus is the hub we are building for ourselves.  Learn more about the people involved in the community here: {linkTo("people", "People")}.</p>
      </>,
  "orb-world": <>
    {topDocLink}
    <h2>About</h2>
    <p>Wanna know about the Orb World?</p>
    <h2>Installation</h2>
    <h2>Getting Started</h2>
    <h2>What's Next?</h2>
  </>,
  "orb-lab": <>
    {topDocLink}
    <h2>About</h2>
    <p>What is Orb Lab?  Many have asked.  Few know.</p>
    <h2>Installation</h2>
    <h2>Getting Started</h2>
    <h2>What's Next?</h2>
  </>,
  "langs": <>
    {topDocLink}
    <p>Each authored work has its own API. You can find the APIs of the currently available Authored Works here:</p>
    <ul>
      <li>Orb World - API coming soon</li>
      <li>Orb Lab - API coming soon</li>
    </ul>
    <p>You can find the API for the <a href="https://www.twitch.tv/codespells" target="_blank">Twitch</a> chat here: Twitch Chat - API coming soon</p>
  </>,
  "getting-started": <>
    <GettingStarted/> 
  </>,
  "people": <>
    {topDocLink}
    <p>Our community is amazing!</p>
  </>,
  "building-new-games": <>
    {topDocLink}
    <p>Want to know how to build your own CodeSpells games?</p>
</>,
}

function Docs(props) {
  const [page, setPage] = useState("one moment")

  useEffect(() => {
    setPage(props.match.params.page)
  },[])
  
  return (
    <>
      <div style={{textAlign: "left"}}>
      <h1>{kabobCaseToTitleCase(page)}</h1>
      {docPageContent[page]}
      </div>
    </>
  );
}

export default Docs;
