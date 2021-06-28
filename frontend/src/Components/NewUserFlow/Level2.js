import React, { useEffect, useState } from 'react';
import Terminal from 'react-console-emulator'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useLocalStorage } from "../../Util";
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import ReactPlayer from 'react-player'
import { SBS, Level, withConfetti } from './Level';
import { SockPuppetChip, FakeChip, NewMessageNotification } from '../Widgets/NexusVoice';

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

function Inventory(props) {
  return (<>
    <Card>
      <CardContent>

          <h2>Inventory</h2>

         </CardContent>
      </Card>
    </>)
    }


function Favor(props) {
  const [shown,setShown] = useState(false)
  return <>
    <Button variant="outlined" color="secondary"
      onClick={() => { props.onOpen(); setShown(true) }}
    >
      A Favor (Click When in Need)
    </Button>
    {shown ? props.contents : ""}
  </>
}


function OpenedMessage(props) {
  return (<>
    <SBS
      leftSideTitle={<>
        <Typography paragraph>From {props.from} to { props.to} </Typography>
        <Typography>Subject: { props.subject}</Typography>
        </>}
      leftSide={
          <div style={{ backgroundColor: "black" }}>
            <ReactPlayer
              fluid={false}
              width={"100%"}
            url={ props.videoUrl}
              controls={true}
              style={{}}
              progressInterval={100}
              onProgress={(p) => { }}
            />
          </div>
      }
      rightSide={ props.text
      }
    />
    </>)
}


function Page1(props) {
  const [messageOpened,setMessageOpened] = useState(false)
  
  return (
   !messageOpened ? <NewMessageNotification
        nexusSays={"Wow!  New messages(s)..."}
        from={<SockPuppetChip></SockPuppetChip>}
        onOpenClicked={
          () => setMessageOpened(true)
        }
      /> :
    <OpenedMessage
      from={<SockPuppetChip />}
      to={<FakeChip name={props.username} level={1} />}
      subject={"The Favor I Owe"}
      videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e1-sock-4.mp4"
      text={
        <>
          <Typography paragraph>
            As I said in the video, just type <tt>help</tt> in the terminal below...
          </Typography>
          <Typography paragraph>
            I've put my favor in your inventory.  Go find it!
          </Typography>
          <Typography paragraph>
            ~Your Friend, Socky
          </Typography>
          <Terminal
            commands={{
              inventory: {
                description: 'Display your inventory.',
                usage: '',
                fn: function () {
                  return <div style={{ marginTop: 20 }}>
                    You have 1 item(s)
                    <ul>
                      <li>
                        Item 1:
                        <Favor onOpen={() => props.setCanContinue(true)}
                          contents={
                            <>
                              <p>
                                You found it!  I'll change this message if we ever get separated.  The favor will stay in your inventory.  Now go click the "Next" button.
                          </p>
                              <p>
                                ~Your Friend, Socky
                          </p>
                            </>
                          } />
                      </li>
                    </ul>
                  </div>
                }
              },
            }}
            welcomeMessage={'You found a Nexus terminal!  You know what to do :)'}
            promptLabel={'mage@Nexus:~$'}
            autoFocus="true"
          />
        </>
      }

      />
  )
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
    <Page2 setCanContinue={withConfetti(setCanContinue)} />,
    <Page3 setCanContinue={withConfetti(setCanContinue)} />,
    <Page4 setCanContinue={withConfetti(setCanContinue)} />,
    <Page5 setCanContinue={withConfetti(setCanContinue)} />]

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