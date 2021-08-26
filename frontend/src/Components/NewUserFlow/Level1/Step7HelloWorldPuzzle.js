import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { JSMirror } from '../../Widgets/Educational';
import { SockPuppetChip, StudentChip, OpenedMessage } from '../../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';
import { spread } from '../../../Util';

function Puzzle({ isComplete, code, hint }) {
  return <>
    <div>
      {code}
      {hint}
    </div>
  </>
}

const Magic = (props) => {
  let unlocked = props.children && JSON.stringify(props.children).includes("Hello, World!")

  return <>
    <Typography>This {unlocked ? "works!" : "doesn't work..."}</Typography>
    <Button
      onClick={() => {
        unlocked = props.children && JSON.stringify(props.children).includes("Hello, World!")
        if (unlocked) {
          props.setComplete(true)
          props.onComplete()
        }
      }}
      color="secondary">{props.children}</Button>
    <Typography paragraph>{props.complete ? ["Look below for the 'Next' button!"] : ""}</Typography>
  </>
}


function ThePuzzle(props) {
  const [complete, setComplete] = useState(false);
  const [code, setCode] = useState("<MagicButton>\n  Next\n</MagicButton>");

  return (
    <Fade in={true} timeout={1000}>
      <Puzzle code={
        <JSMirror code={code}
          scope={{
            MagicButton: (userProps) =>
              React.createElement(Magic, spread(userProps, spread(props, {setComplete, complete})))
          }}
          onChange={(code) => {
            //Note: Could statically read code here...
            setCode(code);
            return true
          }} />
      }
        hint={<>
          <Typography paragraph>Hint: The magic button will only work if it contains the same text as the subject of my email.</Typography>
        </>}
        isComplete={complete} />
    </Fade>
  )
}


function Step7HelloWorldPuzzle(props) {
  let [videoFinished, setVideoFinished] = useState(false);

  /*
  *out of breath* I'm sorry! I was rushing to put together this lesson for you.
 I didn't have time to memorize the Nexus' introductory script, so I'm
 just going to read it to you:
 *someone holds up index card at edge of frame*

 Welcome to the journey of a lifetime! I'm here to train you write your own
 magic spells with code!
 But first we have to see if you have what it takes to learn magic!
 Below this video message is a coding puzzle.  You'll have to read everything
 on this page carefully to pass this test.  Then you can officially enter the Nexus
 and continue your quest to learn magic!

 Okay, I'm going to go off-script here.  The Nexus's analytics show that
 this is the step where most users drop off.  When they have to write their
 first piece of code.
 I know you don't even know me.  And I know I'm just a sock puppet.  
 But could you please write this program?
 It would mean a lot to me.  I would owe you a favor.
 
  */

  return (
    <OpenedMessage
      from={<SockPuppetChip level={1} />}
      to={<StudentChip name={props.username} level={1} />}
      subject={"Hello, World!"}
      videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e-1.2-smaller.ogv"
      text={<>
        <Typography paragraph>The puzzle is to modify the code below to generate a button that lets you proceed to the next part of the Nexus.</Typography>
        <Typography paragraph>~Your Friend, Socky</Typography>
        <ThePuzzle onComplete={() => props.setCanContinue(true)} />
      </>
      }
    />
  ) 
}

export default Step7HelloWorldPuzzle;