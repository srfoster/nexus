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

import { defineStatementRacketBlock, defineRacketBlock } from "../../Dashboard/customBlocks/custom_Blocks.js";

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
import { sendOnCodeSpellsSocket } from '../../WorldWidgets/Util';

//Educational Resources
import { Level3Puzzle1EducationalContent } from '../EducationalResources';


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
  let [username, setUsername] = useLocalStorage("user-name", undefined);
  const [messageOpened, setMessageOpened] = useState(false)
  const openedMessage = useRef(null);

  useEffect(() => {
    if (openedMessage.current)
      { openedMessage.current.scrollIntoView() }
  },[messageOpened])

  return (!messageOpened ? <NewMessageNotification
    nexusSays={"Wow!  New messages(s)..."}
    from={<SockPuppetChip level={3}></SockPuppetChip>}
    onOpenClicked={
      () => {
        setMessageOpened(true)
      }
    }
  /> :
    <div ref={openedMessage}>
      <OpenedMessage
        from={<SockPuppetChip level={3} />}
        to={<StudentChip name={username} level={3} />}
        subject={"A Whole New World!"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e-3.1-smaller.ogv"
        text={
          <>
            <BlocklyPuzzle setCanContinue={props.setCanContinue} />
            <CloseUIButton></CloseUIButton>
          </>
        }
      />
    </div>
  )
}


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

function BlocklyPuzzle(props) {
  const classes = useStyles();
  const [blockIds, setBlockIds] = useState([]);
  const [code, setCode] = useState(undefined);

  useEffect(
    () => {
      setBlockIds([
        defineStatementRacketBlock(
          {
            blockName: "build-sphere",
            inputs: ["position vec", "radius #"],
            output: false,
            doParens: true,
            doBlockName: true,
            color: 230
          }
        ),
        defineStatementRacketBlock(
          {
            blockName: "check-voxels",
            inputs: ["position1 vec", "position2 vec"],
            output: false,
            doParens: true,
            doBlockName: true,
            color: 280
          }
        ),
        defineStatementRacketBlock(
          {
            blockName: "vec",
            inputs: ["x #", "y #", "z #"],
            output: "vec",
            doParens: true,
            doBlockName: true,
            color: 100 
          }
        ),
        defineRacketBlock(
          {
            blockName: "#",
            inputs: [""],
            output: "#",
            doParens: false,
            doBlockName: false,
            color: 80
          }
        ),
        defineStatementRacketBlock(
          {
            blockName: "+",
            inputs: ["#", "#"],
            output: "#",
            doParens: true,
            doBlockName: true,
            color: 80
          }
        ),
      ])
    },
    [])

  return (!blockIds ? "" : <>
    <Typography paragraph>The puzzle is to build a sphere of radius 100 at your orb's location. The location of your orb is:
      <ul>
        <li>X: -484</li>
        <li>Y: 1818</li>
        <li>Z: 6166</li>
      </ul>
    </Typography>

    
    <BlocklyWorkspace
            toolboxConfiguration={{
              kind: "categoryToolbox",
              contents: [
                {
                  kind: "category",
                  name: "Spells",
                  colour: "#c1ba31",
                  contents: 
                    blockIds.map((i) => {
                      return { kind: "block", type: i }
                    })
                },
              ],
            }
            }
            initialXml={'<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'}
            className={classes.spellDetailsCodeMirror}
            workspaceConfiguration={{
              grid: {
                spacing: 20,
                length: 3,
                colour: "#ccc",
                snap: true,
              },
            }}
            onWorkspaceChange={(workspace) => {
              const code = Blockly.JavaScript.workspaceToCode(workspace);
              setCode(code);
            }}
            onXmlChange={() => { }}
  />
    <MagicMirror
      code={code}
      options={{
        readOnly: false //"nocursor"
      }}
      onReturn={(fromUnreal) => {
        if (fromUnreal.responseFor.includes("build-sphere")) {
          //They called the right function...
          //  Now, are the voxels right?

          //Should this take an onerror 3rd param?
          sendOnCodeSpellsSocket("(check-voxels (vec -485 1818 6166))", (d) => {
            if (d.response && d.response.VoxelValueMaterials && d.response.VoxelValueMaterials[0] && d.response.VoxelValueMaterials[0].Value < 1) {
               props.setCanContinue(true)
             }
          })




        }

      }}
    />
  </>
  )
}

function Page1(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-3.1", false)

  return (
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={
        [
          <span><SockPuppetChip level={3}/> welcomes you to his Nexus fork!</span>,
          {
            text: <ChatBubble><Typography>My personality algorithms have been adjusted by Sock Puppet.</Typography></ChatBubble>,
            time: 4000
          },
          {
            text: <ChatBubble><Typography>For example, I no longer get frustrated when Sock Puppet takes too long.</Typography></ChatBubble>,
            time: 4000
          },
          {
            text: <ChatBubble><Typography>And I can be configured to deliver custom messages from Sock Puppet.  Like this one:</Typography></ChatBubble>,
            time: 4000
          },
          {
            text: <Card elevation={4} style={{ marginTop: 20, marginBottom: 20 }}>
              <CardContent>
                <Typography
                  color="textSecondary" gutterBottom
                >Did you know...</Typography>
                <h1>Socks Rock!!!</h1>
              </CardContent>
            </Card>,
            time: 4000
          },
          {
            text: <ChatBubble><Typography>But that's not why we're here.</Typography></ChatBubble>,
            time: 4000
          },
        ]
      }

      SockPuppetMessage={
        <SockPuppetsMessage setCanContinue={ props.setCanContinue}></SockPuppetsMessage>
      }
    />
  ) 
}


export function Level3(props) {
  const [currentPart, setCurrentPart] = useLocalStorage("lvl3:currentPart", 0)
  const [canContinue, setCanContinue] = useState(false)
  
  let reallyContinue = () => {
    if (currentPart + 1 != parts.length) {
      setCanContinue(false);
      setCurrentPart(1 + currentPart)
    } else {
      props.gotoNextLevel()
    }
  }

  let educationalResources =
    [<Level3Puzzle1EducationalContent/>
    //... create educational resources as we add new puzzles
    ]

    let parts = [<Page1 setCanContinue={withConfetti(setCanContinue)} />]
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
          {canContinue ?
            <ContinueButton key="continue-button" onClick={reallyContinue} />
            : ""}
        </CardActions>
      </Level>
    </>
  )
}

export default Level3;
