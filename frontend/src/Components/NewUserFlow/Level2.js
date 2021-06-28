import React, { useEffect, useState } from 'react';
import Terminal from 'react-console-emulator'
import CardContent from '@material-ui/core/CardContent';
import { useLocalStorage } from "../../Util";
import { Level, withConfetti } from './Level';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';

//Questions we're asking (and answering) with our...
//What if there were no difference between edtech, entertainment, content, game, community, open source project, etc.?
//   What if ed tech were different?

const ContinueButton = (props) => {
  return (
    <Fade in={true} timeout={1000}>
      <Button
        color="secondary"
        style={{ marginLeft: "auto", ...props.style }}
        onClick={props.onClick}>Next</Button>
    </Fade>
  );
}

function Page1(props) {
  
  return (<>
    <h2>Puzzle 1</h2>
    <ul>
      <li>Terminal</li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    <Terminal
      commands={{
        echo: {
          description: 'Echoes what you write',
          usage: 'bs',
          fn: function () {
            return `${Array.from(arguments).join(' ')}`
          }
        },
        continue: {
          description: 'Continues',
          usage: 'bs',
          fn: function () {
            props.setCanContinue(true);
            return 'Continuing...' 
          }
        }
      }}
      welcomeMessage={'Welcome to the React terminal!'}
      promptLabel={'mage@Nexus:~$'}
      autoFocus="true"
    />
  </>)
}

function Page2(props) {
  
  return (<>
    <ul>
      <li>Page 2</li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    
  </>)
}

function Page3(props) {
  
  return (<>
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    
  </>)
}

function Page4(props) {
  
  return (<>
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    
  </>)
}

function Page5(props) {
  
  return (<>
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    
  </>)
}

export function Level2(props) {
  const [currentPart, setCurrentPart] = useLocalStorage("lvl2:currentPart", 0)
  const [canContinue, setCanContinue] = useState(false)
  
  let reallyContinue = () => {
    if (currentPart + 1 != parts.length) {
      setCanContinue(false);
      setCurrentPart(1 + currentPart)
    } else {
      props.gotoNextLevel()
    }
  }
  
  let parts =
    [<Page1 setCanContinue={withConfetti(setCanContinue)} />,
    <Page2/>,
    <Page3/>,
    <Page4/>,
    <Page5/>]

  return (
    <>
      <Level number={2} subtitle={"Beyond the Gate"}>
        <CardContent>
          {parts[currentPart]}
        </CardContent>
        <CardActions>
          <Button key="back-button"
            onClick={() => {
              if (currentPart == 0) {
                props.gotoPrevLevel()
              } else {
                setCurrentPart(currentPart - 1);
                setCanContinue(false);
              }
            }}>Back</Button>
          {canContinue || currentPart == parts.length - 1 ?
            <ContinueButton key="continue-button" onClick={reallyContinue} />
            : ""}
        </CardActions>
      </Level>
    </>
  )
}
/* Lindsey: Spaced repetition */
/*
Laurond: I have a character for you.. an individual who starts out in the lower caste and isn't considered creative or precise during childhood because their paintings and images make no sense to others, but then the *disruptive plot device event* causes them and a few others to be in a survival situation apart from the rest of the community, and nobody knows what to do, but the character has some ideas, and start learning how to communicate them instead of making the abstract art they used to make.
*/

export default Level2;