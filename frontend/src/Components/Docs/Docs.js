import React, { useState, useEffect } from 'react';
import {titleCase} from '../../Util.js';
import CodeMirror from 'codemirror';
import {UnControlled as ReactCodeMirror} from 'react-codemirror2';

const linkTo = (s,t) => <a href={"/docs/"+s}>{t}</a>

const topDocLink = linkTo("docs", "Back to Top")


function GettingStarted(props){
  return <>{topDocLink}
		
		<p>We think the best way to get started with CodeSpells is to cast a spell as soon as possible.</p>

		<p>You should know that whenver we say "cast a spell", we simultaneously mean "run some code."  In CodeSpells, code and spells are the same.</p>

		<p>Here's the spell we are going to cast:</p>

            <ReactCodeMirror
	value={
`(loop 

  (define foods (find-all-nearby))

  (map (lambda (f)
	 (eat f 100))
	foods)

  )`
	}
              options={{
                lineWrapping: true,
                mode: 'scheme',
                theme: 'material',
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true,
              }}
            /> :
		<pre>
		  <code>
		  </code>
		</pre>

		<p>[TODO: Talk about mana system!!]</p>
	</>
}

const docPageContent = {
 docs: <>
        <p>Welcome to the Nexus! [Say more about what the Nexus is...]</p>
	<p>If it's your first time here, we recommend: {linkTo("getting started", "Getting Started")}</p>
        <p>There are two CodeSpells worlds in the Nexus right now.  You can read more about those here:</p>
        <ul>
          <li>{linkTo("orb world",      "Orb World")}</li>
          <li>{linkTo("orb lab",        "Orb Lab")}</li>
          <li>{linkTo("world building", "Make your own world")}</li>
        </ul>
        <p>If you're just looking for the spell-crafting APIs, here they are: {linkTo("langs", "APIs")}</p>
        <p>Above all, CodeSpells is a community, and the Nexus is the hub we are building for ourselves.  Learn more about the people involved in the community here: {linkTo("people", "People")}.</p>
      </>,
 "orb world": <>{topDocLink}<p>Wanna know about the Orb World?</p></>,
 "orb lab": <>{topDocLink}<p>What is Orb Lab?  Many have asked.  Few know.</p></>,
 "langs": <>{topDocLink}<p>Here are the APIs...</p></>,
 "getting started": <GettingStarted />,
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
