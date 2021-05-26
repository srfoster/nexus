import React, { useState, useEffect } from 'react';
import CodeMirror from 'codemirror';
import {UnControlled as ReactCodeMirror} from 'react-codemirror2';
import ConnectionIndicator from '../Client/ConnectionIndicator';
import {linkTo, topDocLink} from './util.js';
import Button from '@material-ui/core/Button';

function GettingStarted(props) {
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
            /> 
    <p>But first, you're gonna have to download a CodeSpells world. Download Orb World <a href="https://codespells-org.s3.amazonaws.com/StandaloneBuilds/orb-world/0.0/OrbWorld.7z">here</a>.</p>
    <p>Double click the executable that downloaded to your computer. When the game starts, you should notice the connection indicator below say "Connected".</p>
    <ConnectionIndicator afterConnection={<><AfterConnection/></>}/>
	</>
}

function AfterConnection(props){    
    return <>
        <p>Yay! You got connected! Good job!</p>
        <p>Now, we're going to cast some spells in the game! This is a Cast button:</p>
        <CastButton code={`(color "green")`}/>
        <p>Anytime you see a Cast button, you can click it and cast a spell in game. This one is going to be a mystery. Cast it and see what happens!</p>
        <p>In game, you should now see a new orb spawned near you that's green! You can click as many times as you want and spawn lots of orbs!</p>
        <p>You'll usually see the Cast button inside a code editor. You can edit the code before casting a spell in-game. Try to change the color of the spawned orb to red:</p>
        <MagicMirror code={`(color "red")`}/>
        <p>You'll notice there are lots of small orbs that spawn in this world. Let's try to increase our mana by eating these orbs. ...</p>
        <p></p>
        <p></p>
    </>
}

function MagicMirror(props) {
    const [code, setCode] = useState(props.code);

    return <>
        <ReactCodeMirror
            value={
                props.code
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
            onChange={(editor, data, value) => {
                setCode(value);
            }}
        />
        <CastButton code={code} />
    </>
}

function CastButton(props) {
    
    return <><Button
        onClick={() => {
            window.CodeSpellsSocket.send(props.code);
        }}
        variant="contained"
        color="primary">
            Cast
        </Button></>
}

export default GettingStarted;