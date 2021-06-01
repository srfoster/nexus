import React, { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import GettingStarted from './GettingStarted.js';
import People from './People.js';
import {linkTo, topDocLink} from './util.js';
import { kabobCaseToTitleCase } from '../../Util.js';

//TODO: Move to its own service file...
const ApiService = {
  getDocumentedFunctions(){
    return fetch(`http://localhost:8090/api`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  }
}

function APIDocs(props) {
  const [functions, setFunctions] = useState()

  useEffect(() => {
    ApiService.getDocumentedFunctions()
      .then((fs) => {
        setFunctions(fs)
      })
  },[])

  return !functions ? <p>Loading...</p> : functions.map(e => <FunctionDoc {...e} />)
}

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
        <p>If you just want to write spells and you're looking for the spell-crafting APIs, you can find them in our {linkTo("langs", "Langs")} section.</p>
        <p>Above all, CodeSpells is a community, and the Nexus is the hub we are building for ourselves.  Learn more about the people involved in the community in the {linkTo("people", "People")} section.</p>
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
    <p>You can find the API here:</p>
    <APIDocs />
  </>,
  "getting-started": <>
    <GettingStarted/> 
  </>,
  "people": <>
    <People/>
  </>,
  "building-new-games": <>
    {topDocLink}
    <p>Want to know how to build your own CodeSpells games?</p>
</>,
}

function FunctionDoc(props) {
  return (
    <><Card style={{margin: 10}}>
      <CardContent>
        <p><code>(<strong>{props.name + " "}</strong> {props.parameters.map(e => e.name).join(" ")}) → {props.returnType} </code></p>
        <div style={{paddingLeft: 10, paddingBottom: 10}}>{props.parameters.map(e => (<div><code>{e.name} : {e.type}</code></div>))}</div>
        <Markdown>{props.content}</Markdown>
      </CardContent>
    </Card>
    </>
 ) 
}

function Param(props) {
  return (
    <p>
      {props.name}
      {props.type}
   </p>
 ) 
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