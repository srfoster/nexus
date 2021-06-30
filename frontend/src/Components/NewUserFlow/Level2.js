import React, { useEffect, useRef, useState } from 'react';
import Terminal from 'react-console-emulator'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useLocalStorage } from "../../Util";
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import ReactPlayer from 'react-player'
import CircularProgress from '@material-ui/core/CircularProgress';
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
        <Typography paragraph>From {props.from} to {props.to} </Typography>
        <Typography>Subject: {props.subject}</Typography>
      </>}
      leftSide={
        <div style={{ backgroundColor: "black" }}>
          <ReactPlayer
            fluid={false}
            width={"100%"}
            url={props.videoUrl}
            controls={true}
            style={{}}
            progressInterval={100}
            onProgress={(p) => { }}
          />
        </div>
      }
      rightSide={props.text
      }
    />
  </>)
}

//VIDEO SCRIPT
// Thanking
// Explaining what Nexus is

/*
Thank you so much!  Since I've been working for the Nexus,
I've only had a few students get past the first puzzle!

  [Corkboard: kenzo, jess, thefastsnake, woogachaka,  laurond, jonpi, trithir]
 
I'm going to do my best to make these coding experiences as fun as I can! 
Oh shoot. I called it coding! I meant spellcrafting! 

Ok, lemme tell you how things work here at the Nexus...
As you may have noticed, you're inside of a puzzle game. But it's also supposed
to be an educational experience to learn coding. But we don't call it coding around here.
We call it *magic*. I don't really know why.

All I know is, the Nexus gives me learning objectives and I'm supposed to make
personalized educational videos and puzzles just for you.  For example, right now,
the Nexus says that after this puzzle you're supposed to know about how terminals
work here in the Nexus. 

But instead of giving a boring lecture about terminals, I'm going to give you a shortcut. 
Any time you find a terminal in the Nexus, you can just type "help."  The terminal
will tell you what else you can type.

Oh, and don't worry.  I haven't forgotten about the fact that I owe you a favor.
You'll see.  Try the puzzle below.

*/

const SockPuppetsMessage = (props) => {
  const [messageOpened, setMessageOpened] = useState(false)
  const openedMessage = useRef(null);

  useEffect(() => {
    if (openedMessage.current)
      { openedMessage.current.scrollIntoView() }
  },[messageOpened])

  return (!messageOpened ? <NewMessageNotification
    nexusSays={"Wow!  New messages(s)..."}
    from={<SockPuppetChip></SockPuppetChip>}
    onOpenClicked={
      () => {
        setMessageOpened(true)
      }
    }
  /> :
    <div ref={openedMessage}>
      <OpenedMessage
        from={<SockPuppetChip />}
        to={<FakeChip name={props.username} level={1} />}
        subject={"The Favor I Owe"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e3.mp4"
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
    </div>
  )
}

//TODO: Flicker bug, real content
function PleaseWaitWhileSockPuppetCreatesContent(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-2", false)
  var [step, setStep] = useState(messageOpened ? props.NexusStallingMessages.length : 0)

  useEffect(() => {

    if (!messageOpened) {
      let total = 0
      for (let i = 0; i < props.NexusStallingMessages.length; i++){
        let e = props.NexusStallingMessages[i]
        setTimeout(() => {
          if (i == props.NexusStallingMessages.length - 1) {
            setTimeout(()=>setMessageOpened(true), total + (e.time || 2000))
          }
          setStep(i+1)
        },  total)

        total += (e.time || 2000)
      }
    }
  }, [])

  return (
    <>
      <div>
        {props.NexusStallingMessages.slice(0, step).map((e,i) =>
          <Fade key={ "nexusMessage" + i} in={true}>
            <Typography paragraph>{e.text || e}</Typography>
          </Fade>)}
      </div>
      { messageOpened ? props.SockPuppetMessage : <CircularProgress style={{ marginTop: 20 }} />}

    </>
  )
}

function Page1(props) {
  const [nexusDoneTalking,setNexusDoneTalking] = useState(false)
 
  useEffect(() => {
    setTimeout(() => setNexusDoneTalking(true), 3000)
  })
 
  return (
    <PleaseWaitWhileSockPuppetCreatesContent
      NexusStallingMessages={[<span><SockPuppetChip /> is making video content!</span>
        , {
          text: "Because Sock Puppet has been slower than average, we have prepared some entertainment.",
          time: 5000
        },
        {
          text: "Here's a fun fact!",
          time: 2000
        },
        {
          text: <Card>
            <CardContent>
              <Typography
                color="textSecondary" gutterBottom
              >Did you know...</Typography>

              ...the Nexus was founded by two eccentric thousandaires during the COVID-19 lockdown of the year 2020?
            </CardContent>
          </Card>,
          time: 5000
        },
      ]}
      SockPuppetMessage={<SockPuppetsMessage {...props} />}
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