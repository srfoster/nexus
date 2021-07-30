import React, { useRef, useEffect, useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { useLocalStorage, spread } from "../../../Util";
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import { SockPuppetChip, FakeTeacherChip, StudentChip, NewMessageNotification, PleaseWaitWhileSockPuppetCreatesContent, OpenedMessage } from '../../Widgets/NexusVoice';
import { SBS, Level, withConfetti, ContinueButton } from '../Level';
import useStyles from '../../../styles.js';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { Game } from '../../Widgets/react-gameoflife/Game.js';

// //3d Stuff...
//import { Canvas, useFrame } from '@react-three/fiber'

// //Blockly...
import { BlocklyWorkspace } from "react-blockly";
import Blockly from "blockly";

// //Runes...
import Draggable from 'react-draggable';
import ChatBubble from '../../Widgets/ChatBubble/';
import { MagicMirror } from '../../MagicMirror';
import CloseUIButton from '../../WorldWidgets/CloseUIButton';


// /*

// Stephen's widget wishlist:
// * Calendar?  Trello?  (Meta: time management of learning)
// * Flashcards?  (SRS)
// * Spreadsheet
// * Simulation / sugarscape / net logo
// * Coding: Blockly, Runes, Dataflow... 
// * Pixel editor
// * Chat
// * Impress js - Hard to confine to one div...
// * Tensor Flow - What is an interesting model to use?  How to get it to work with react-tensorflow?
// * Konva
// */



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
        to={<StudentChip name={props.username} level={2} />}
        subject={"A Whole New World!"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/2.3.ogv"
        text={
          <>
            hiiiii
          </>
        }
      />
    </div>
  )
}


/*

function Box(props) {
  // This reference will give us direct access to the THREE.Mesh object
  const meshRef = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [speed, setSpeed] = useState(props.speed)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    (meshRef.current.rotation.x += meshRef.current.speed)
  })

  useEffect(() => { meshRef.current.speed = speed },[speed])

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    React.createElement('mesh',
      spread(props,
        {
          ref: meshRef,
          scale: active ? 1.5 : 1,
          onClick: (event) => {
            setActive(!active)
          },
          onPointerOver: (event) => setHover(true),
          onPointerOut: (event) => setHover(false)
        }),
      [
        <boxGeometry args={[1, 1, 1]} />,
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      ]
    ))
}

function BoxDemo(props) {
  const [sliderValue, setSliderValue] = useState(50);
  return <>
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box speed={sliderValue / 1000} position={[-1.2, 0, 0]} />
      <Box speed={sliderValue / 500} position={[1.2, 0, 0]} />
    </Canvas>
    <Slider
      value={sliderValue}
      onChange={
        (e, newValue) => {
          setSliderValue(newValue)
        }
      }
      aria-labelledby="continuous-slider" />
  </>
}

*/


function Rune(props){
  return <Draggable
    grid={[25, 25]} >
    <div style={{
      margin: 0,
      padding: 0,
      width: 50,
      height: 50,
      backgroundColor: props.color,
      cursor: "pointer",
      display: "inline-block"
    }}>{props.children}</div>
  </Draggable>
}

function Parens(props) {
  return <Draggable handle=".handle">
    <div style={{
      backgroundColor: "gray",
      cursor: "pointer",
      width: props.children.length*50, //What?
      height: 100,
      display: "inline-block"
    }}>
      <div className={"handle"}>Drag here</div>
      {props.children}
    </div>
  </Draggable>
}

function RuneDemo(props){
  return <Card style={{ height: 500 }}><CardContent>
    <Rune color="blue">Water</Rune>
    <Parens>
      <Rune color="blue">Water</Rune>
      <Rune color="red">Fire</Rune>
    </Parens>
  </CardContent></Card> 
}

function Page1(props) {
  const classes = useStyles();

  var [messageOpened, setMessageOpened] = useState(false) //useLocalStorage("sock-puppet-lesson-opened-2", false)
  return (
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={
        [
          <CloseUIButton></CloseUIButton>, 
          <span><SockPuppetChip /> welcomes you to his Nexus fork!</span>,
          <ChatBubble><Typography>My personality algorithms have been adjusted by Sock Puppet</Typography></ChatBubble>,
          <ChatBubble><Typography>For example, I no longer get frustrated when Sock Puppet takes too long.</Typography></ChatBubble>,
          <ChatBubble><Typography>And I can be configured to deliver custom messages from Sock Puppet.  Like this one:</Typography></ChatBubble>,
          {
            text: <Card style={{ marginTop: 20, marginBottom: 20 }}>
              <CardContent>
                <Typography
                  color="textSecondary" gutterBottom
                >Did you know...</Typography>
                <h1>Socks Rule!!!</h1>
              </CardContent>
            </Card>,
            time: 5000
          },
          <ChatBubble><Typography>Or this one:</Typography></ChatBubble>,
          {
            text: <Card style={{ marginTop: 20, marginBottom: 20 }}>
              <CardContent>
                <Typography
                  color="textSecondary" gutterBottom
                >Did you know...</Typography>
                
              </CardContent>
            </Card>,
            time: 5000
          },
          <ChatBubble><Typography>But that's not why we're here.</Typography></ChatBubble>,
        ]
      }

      SockPuppetMessage={
        spread(<SockPuppetsMessage></SockPuppetsMessage>, props)
      }
    />
  ) 
}

// function Page2(props) {
  
//   return (<>
//     <ul>
//       <li>Page 2</li>
//       <li></li>
//       <li></li>
//       <li></li>
//     </ul>
    
//   </>)
// }

// function Page3(props) {
  
//   return (<>
//     <ul>
//       <li></li>
//       <li></li>
//       <li></li>
//       <li></li>
//     </ul>
    
//   </>)
// }

// function Page4(props) {
  
//   return (<>
//     <ul>
//       <li></li>
//       <li></li>
//       <li></li>
//       <li></li>
//     </ul>
    
//   </>)
// }

// function Page5(props) {
  
//   return (<>
//     <ul>
//       <li></li>
//       <li></li>
//       <li></li>
//       <li></li>
//     </ul>
    
//   </>)
// }

export function Level3(props) {
  const [currentPart, setCurrentPart] = useLocalStorage("lvl3:currentPart", 0)
  const [canContinue, setCanContinue] = useState(false)
  
  let parts = [<Page1/>]
  //   [<Page1/>,
  //   <Page2/>,
  //   <Page3/>,
  //   <Page4/>,
  //   <Page5/>]

  return (
    <>
      <Level number={3} subtitle={"The Mission"}>
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
          <ContinueButton onClick={() => setCurrentPart(currentPart + 1)} />
        </CardActions>
      </Level>
    </>
  )
}

export default Level3;
