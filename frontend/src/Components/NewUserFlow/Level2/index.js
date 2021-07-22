import React, { useEffect, useMemo, useRef, useState } from 'react';
import Terminal from 'react-console-emulator'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { useLocalStorage } from "../../../Util";
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SBS, Level, withConfetti, AccountCreationReminder } from '../Level';
import { SockPuppetChip, FakeTeacherChip, StudentChip, NewMessageNotification, PleaseWaitWhileSockPuppetCreatesContent, OpenedMessage } from '../../Widgets/NexusVoice';
import { JSMirror } from '../../Widgets/Educational';
import { Game } from '../../Widgets/react-gameoflife/Game.js';
import PianoSimulator from '../../Widgets/PianoSimulator.js';
import NetworkDiseaseSimulator from '../../Widgets/NetworkDiseaseSimulator.js';
import BlueBalls from '../../Widgets/BlueBalls.js';
import CasinoIcon from '@material-ui/icons/Casino';
import ChatBubble from '../../Widgets/ChatBubble';

//Questions we're asking (and answering) with our..
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


function Favor(props) {
  const [shown,setShown] = useState(false)
  return <>
    <Button variant="outlined" color="secondary"
      onClick={() => { props.onOpen && props.onOpen(); setShown(true) }}
    >
      A Favor (Click When in Need)
    </Button>
    {shown ? props.contents : ""}
  </>
}

function SockPuppetFavorInInventory(props) {
  return <div style={{ marginTop: 20 }}>
    You have 1 item(s)
                    <ul>
      <li>
        Item 1:
          <Favor onOpen={() => props.onOpen && props.onOpen()}
          contents={props.content ||
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
        to={<StudentChip name={props.username} level={1} />}
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
                    return <SockPuppetFavorInInventory
                      onOpen={ () => props.setCanContinue(true) }/>
                  }
                },
              }}
              welcomeMessage={''}
              promptLabel={'mage@Nexus:~$'}
              autoFocus={true}
            />
          </>
        }
      />
    </div>
  )
}


function Page1(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-2", false)
  return (
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip /> is making video content!<br/><br/></span>
        , {
          text: "Because Sock Puppet has been slower than average, my entertainment algorithms have been activated.",
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

              ...I (the Nexus) was built by two eccentric thousandaires during the COVID-19 lockdown of the year 2020?
            </CardContent>
          </Card>,
          time: 5000
        },
        {
          text: <span><br/><br/> <SockPuppetChip /> is <strong>still</strong> making video content...<br/><br/></span>,
          time: 2000
        },
        {
          text: "Here's another fact!",
          time: 1000
        },
        {
          text: <Card>
            <CardContent>
              <Typography
                color="textSecondary" gutterBottom
              >Did you know...</Typography>

              ...the Nexus's software architects have not been seen since the year 2022?
            </CardContent>
          </Card>,
          time: 5000
        },
        {
          text: <span><br/><br/> <SockPuppetChip /> is <strong>still</strong> making video content...<br/><br/></span>,
          time: 2000
        },
        {
          text: "Here's another fact!",
          time: 1000
        },
        {
          text: <span>Ahh.  Never mind.  <SockPuppetChip /> is <strong>finally</strong> finished.<br/><br/></span>,
          time: 1000
        },
      ]}
      SockPuppetMessage={<SockPuppetsMessage {...props} />}
    />
  )
}

function Page2(props) {  
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-3", false)

  return (
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip /> is making video content!</span>,
        { 
          text: "My entertainment algorithms tell me that humans like to play with toys.",
          time: 3000
        },
        {
          text: "Here is a toy...",
          time: 1000
        },
        {
          text: <><Game/></>,
          time: 10000
        },
        {
          text: <Typography paragraph style={{marginTop: 10}}>I hope you are enjoying the toy...</Typography>,
          time: 10000
        },
        {
          text: "Please continue enjoying the toy.",
          time: 10000
        },
        {
          text: "Sock Puppet will be disciplined for lateness in 10 seconds. Please continue enjoying your toy!",
          time: 10000
        },
      ]}
      SockPuppetMessage={<SockPuppetsMessage2 {...props} />}
    />
  )
}


function Page3(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-4", false)

  return (<>
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip /> is making video content!</span>,
        {
          text: <Typography paragraph><br/>My edutainment algorithms are still active.  I will now give you another educational mystery toy.</Typography>,
          time: 3000
        },
        {
          text: <NetworkDiseaseSimulator
            nodes={["woogachaka", "fastsnake", "laurond", "kenzo", "that_onion", "cringelord713", "Sock Puppet", "You!"]}
            edges={[["Sock Puppet", "You!"], ["laurond", "kenzo"], ["kenzo", "fastsnake"], ["kenzo", "cringelord713"], ["cringelord713", "that_onion"], ["that_onion", "woogachaka"], ["that_onion", "Sock Puppet"]]}
            patientZero={ "laurond" }
          />,
          time: 3000
        },
        {
          text: "Please keep enjoying the toy...",
          time: 3000
        },
      ]}
      SockPuppetMessage={<SockPuppetsMessage3 {...props} />}
    />

  </>)
}

function SockPuppetsMessage3(props) {
  const [messageOpened, setMessageOpened] = useState(false);
  const openedMessage = useRef(null);
  const [code, setCode] = useState("<Toy\n  nodes={['You!','Sock Puppet']}\n  edges={[['You!','Sock Puppet']]}\n  patientZero={'Sock Puppet'}/>");

  const setCanContinue = props.setCanContinue

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
        to={<FakeTeacherChip name={props.username} level={1} />}
        subject={"Fundamentals of Magic, Part 2"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e3.mp4"
        text={
          <>
            <Typography paragraph>
              The Puzzle is to make someone named John sick on the 5th day.  There are many solutions.
            </Typography>
            <Typography paragraph>
              <br />
              ~Your Friend, Socky
          </Typography>
            <JSMirror code={code}
              scope={{
                Toy: (props) => {
                  let [showSimulator, setShowSimulator] = useState(false);
                
                  useEffect(() => {
                    let isMounted = true
                    setTimeout(() => {
                      if(isMounted) setShowSimulator(true)
                    }, 1000);
                    return () => { isMounted = false }
                  },[])


                  return (<>
                    { showSimulator ?
                      <NetworkDiseaseSimulator {...props}
                        onChange={(data) => {
                          if (data.explored.indexOf("easteregg") >= 0 || (data.explored.indexOf("John") >= 0 && data.iteration == 5)) setCanContinue(true)

                        }}
                      /> :
                      <Card style={{height: "525px"}}><CardContent><CircularProgress/></CardContent></Card>
                    }
                  </>)
                }
              }}

              onChange={(code) => {
                setCode(code)
                return true
              }} />
            </>
        } />
    </div>
  )
}


function SockPuppetsMessage4(props) {
  const [messageOpened, setMessageOpened] = useState(false);
  const openedMessage = useRef(null);
  const [code, setCode] = useState("<Toy\n  instrument=\"alto_sax\"\n  buttons={\n    {\"C-Chord\": [\"A\",\"D\",\"G\"],\n     \"F-Chord\": [\"A\",\"F\",\"H\"]}\n  } />");
  const setCanContinue = props.setCanContinue

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
        to={<FakeTeacherChip name={props.username} level={1} />}
        subject={"Fundamentals of Magic, Part 3"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e3.mp4"
        text={
          <>
            <Typography paragraph>
              The Puzzle is to add a button that plays a G-Chord
            </Typography>
            <Typography paragraph>
              <br />
              ~Your Friend, Socky
          </Typography>
            <JSMirror code={code}
              scope={{
                Toy: (props) => {
                  const [showPiano,setShowPiano] = useState(false)
                  const [notes,setNotes] = useState([])

                  let buttons = props.buttons

                  const toMidi = function (letter) {
                    return 48 + ["A","W","S","E","D","F","T","G","Y","H","U","J","K"].indexOf(letter)
                  }

                  useEffect(
                    () => {
                      let isMounted = true;
                      setTimeout(() => {
                        if(isMounted) setShowPiano(true)
                      }, 1000)
                      return () => { isMounted = false }
                    }, [])

                  return !showPiano ? <CircularProgress /> :
                   <>
                    {Object.keys(buttons).map((k) =>
                      <Button key={k}
                        onMouseDown={() => {
                          setTimeout(() => {
                            if (buttons[k].indexOf("S") >= 0 &&
                              buttons[k].indexOf("G") >= 0 &&
                              buttons[k].indexOf("J") >= 0) {
                              setCanContinue(true)
                            }
                          }, 1000)
                          setNotes(buttons[k].map(toMidi));
                        }}
                        onMouseUp={() => {
                          setNotes([])
                        }}
                        onMouseLeave={() => {
                          setNotes([])
                        }}
                      >{k}</Button>
                    )}
                    <PianoSimulator {...props}
                      activeNotes={ notes }
                      onNoteStarted={(midinumber) => {
                      }}
                    />
                  </>
                }
              }}

              onChange={(code) => {
                setCode(code)
                return true
              }} />
            </>
        } />
    </div>
  )
}

function Page4(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-5", false)

  return (<>
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip /> is making video content!</span>,
        {
          text: <Typography paragraph><br/>My edutainment algorithms are still active.  I will now give you another educational mystery toy.</Typography>,
          time: 3000
        },
        {
          text: <PianoSimulator
          />,
          time: 3000
        },
        {
          text: "Please keep enjoying the toy...",
          time: 3000
        },
      ]}
      SockPuppetMessage={<SockPuppetsMessage4 {...props} />}
    />

  </>)
}
  
function bfs(first, rest) {
  let island = [first];
  let added = true;
  let unprocessed = [...rest]

  while (added) {
    added = false;
    let toAddToIsland = []
    let toRemoveFromUnprocessed = []

    for (let cell1 of unprocessed) {
      for (let cell2 of island) {
        if (cellsAdjacent(cell1, cell2)) {
          toAddToIsland.push(cell1);
          toRemoveFromUnprocessed.push(cell1);
          added = true;
        }
      }
    }

    for (let c of toAddToIsland) {
      if(island.indexOf(c) == -1)
        island.push(c)
    }

    for (let c of toRemoveFromUnprocessed) {
      let i = unprocessed.indexOf(c)
      if(i>-1)
        unprocessed.splice(i, 1);
    }
  }

  return island;
}

//AKA find disconnected components in the graph
//  Cytoscape can obviously do this, but for educational purposes, let's do the algorithm ourselves 
//  (for the few brave souls who actually attempt this puzzle instead of just 
//   listening to Sock Puppet and downloading Orb World!)
//  TODO: Put link to Orb World here in the source code so people can get to it easier 
//  TODO: Put in some kind of message here that makes it clear to the player to that the
//        correct next step in the game is actually to do the Orb World download (not this diabolical puzzle) 
function findIslands(cells) {
  // Cells -> List of Islands (List of Cells)
  // Input: Cells are a list of objects
  // e.g. [{x:0, y:0},{x:1,y:0}]


  // While there are unprocessed cells...
  // Grab 1 cell. Instantiate a new island with that cell in it.
  // Do an exhaustive BFS for cells that are connected to that one. Push each of these onto the island list. Remove them from unprocessed cells list.
  let unprocessed = [...cells];
  let islands = [];


  while (unprocessed.length > 0) {
    let current = unprocessed.pop();

    let island = []
    let list_of_cells = bfs(current, unprocessed); 
    for (let cell of list_of_cells) {
      island.push(cell);
      let i = unprocessed.indexOf(cell)
      if(i>-1)
        unprocessed.splice(i, 1);
    }
    islands.push(island)
  }

  return islands
}

function cellsAdjacent(n, m) {
  return (Math.abs(n.x-m.x) === 1 && (n.y === m.y)) || (Math.abs(n.y-m.y) == 1 && (m.x === n.x))
}

function SockPuppetsMessage5(props) {
  const [messageOpened, setMessageOpened] = useState(false);
  const openedMessage = useRef(null);
  const [code, setCode] = useState("<Toy\n  />");
  const [cells, setCells] = useState([]);
  const [showSimulator, setShowSimulator] = useState(false);
  const [puzzleStarted, setPuzzleStarted] = useState(false);
  const [numberSick, setNumberSick] = useState(0);
  const setCanContinue = props.setCanContinue

  useEffect(() => {
    let islands = findIslands(cells)
    let sortedIslandLengths = islands.map((i) => i.length).sort()

    if(JSON.stringify(sortedIslandLengths) == "[2,3,4,5,6]" && numberSick == 6) setCanContinue(true)
  }, [cells, numberSick])
  
  useEffect(() => {
    setTimeout(() => {
      setShowSimulator(true)
    }, 1000)
  }, [cells])

  //Prepare the output of conway's game of life as input for cytoscape
  const nodes = cells.map((c) => c.x + "," + c.y);
  const adjPairs = [];
  for (let n of cells) {
    for (let m of cells) {
      if((Math.abs(n.x-m.x) === 1 && (n.y === m.y)) || (Math.abs(n.y-m.y) == 1 && (m.x === n.x)))
        adjPairs.push([n, m]);
    }
  }
  const edges = adjPairs.map(p => [p[0].x + "," + p[0].y, p[1].x + "," + p[1].y])

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
        to={<FakeTeacherChip name={props.username} level={1} />}
        subject={"Fundamentals of Magic, Part 4"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e3.mp4"
        text={
          <>
            <Typography paragraph>
              sup bro.  try the puzzel below.  it's so hard it's siiiiick
            </Typography>
            <Terminal
              commands={{
                startPuzzle: {
                  description: 'start the sick puzzle dudeeeee',
                  usage: '',
                  fn: function () {
                    setPuzzleStarted(true);
                  }
                },
                inventory: {
                  description: 'Display your inventory.',
                  usage: '',
                  fn: function () {
                    return <SockPuppetFavorInInventory
                      content={
                        <>
                          <p>That Sock Puppet isn't me!  It's an imposter!</p>
                          <p>He's also given you a puzzle that's impossible to solve without looking at the source code!  The Nexus is trying to trap you here.</p>
                          <p>Look, I'm taking a big risk by doing this, but if you download the world below, I can finally talk freely with you about the Nexus.</p>
                          <p>~Your Friend, Socky</p>
                          <Button color="secondary" variant="outlined">Download</Button>
                        </>
                      }
                    />
                  }
                },
              }}
            />{
              puzzleStarted ?
                <><Game setCells={(cells) => {
                  setCells(cells);
                  setShowSimulator(false);
                }} />
                  {showSimulator ?
                    <NetworkDiseaseSimulator
                      nodes={nodes}
                      edges={edges}
                      patientZero={"4,5"}
                      onChange={(data) => {
                        setNumberSick(data.explored.length)

                      }}
                    /> :
                    <Card style={{ height: "525px" }}><CardContent><CircularProgress /></CardContent></Card>
                  }
                </> : <></>}
          </>
        } />
    </div>
  )
}

function Page5(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-5", false)

  return (<>
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip /> is making video content!</span>,
        {
          text: <Typography paragraph><br />My edutainment algorithms are still active.  I will now give you another educational mystery toy.</Typography>,
          time: 3000
        },
        {
          text: <BlueBalls/>,
          time: 3000
        },
        {
          text: "Please keep enjoying the toy...",
          time: 3000
        },
      ]}
      SockPuppetMessage={<SockPuppetsMessage5 {...props} />}
    />

  </>)
}


const SockPuppetsMessage2 = (props) => {
  const [messageOpened, setMessageOpened] = useState(false)
  const openedMessage = useRef(null);

  let Toy = (props) => {

    return <Game {...props}
      setCells={(cells) => {
        props.setCells(cells)
      }}
    />
  }

  useEffect(() => {
    if (openedMessage.current) { openedMessage.current.scrollIntoView() }
  }, [messageOpened])

  const [firstColor, setFirstColor] = useState("red")
  const [secondColor, setSecondColor] = useState("lime")

  const [firstGameState, setFirstGameState] = useState([])
  const [secondGameState, setSecondGameState] = useState([])

  const [firstCode, setFirstCode] = useState("<Toy\n color=\"" + firstColor + "\"\n boardLabel=\"Edit my squares...\"\n buttonsLabel=\"or try the buttons below....\" /> ")

  const [secondCode, setSecondCode] = useState("<Toy\n color=\"" + secondColor + "\"\n boardLabel=\"Edit my squares...\"\n buttonsLabel=\"or try the buttons below....\" /> ")

  const [puzzleDone, setPuzzleDone] = useState(false)

  function checkPuzzleComplete() {
    if (!puzzleDone && firstColor == "#FF1493" && secondColor == "#00BFFF" && firstGameState.length > 0 && secondGameState.length > 0) {
      setPuzzleDone(true)
      props.setCanContinue(true)
    }
  }

  useEffect(checkPuzzleComplete, [firstColor, secondColor, firstGameState, secondGameState])

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
        to={<StudentChip name={props.username} level={1} />}
        subject={"Fundamentals of Magic, Part 1"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e3.mp4"
        text={
          <>
            <Typography paragraph>
              The Puzzle is to interpret the cryptic message below.
            </Typography>
            <Card>
              <CardContent>
                <Typography paragraph
                  color="textSecondary" gutterBottom >
                  Cryptic message... </Typography>
                <Typography paragraph>
                  Alter the Spell for each Toy so that the color properties are <tt style={{ color: "#FF1493" }}><span> #FF1493 </span></tt> and <tt style={{ color: "#00BFFF" }}>#00BFFF</tt>.</Typography>

                <Typography paragraph>
                  Then, click <Button variant="outlined"><CasinoIcon /> Random</Button> and on each Toy at least once.

                  (If you can't figure out what the <Button variant="outlined">Next</Button> button does, don't worry.  That's for later puzzles!)
            </Typography>
              </CardContent>
            </Card>
            <Typography paragraph>
              <br />
              ~Your Friend, Socky

          </Typography>
            <JSMirror code={firstCode}
              scope={{
                Toy: (props) => { 
                  return <Toy {...props} 
                    noRun={true}
                    cells={firstGameState}
                    setCells={(cells) => {
                      if (cells.length !== 0) {
                        setFirstColor(cells[0].color)
                      }
                      setFirstGameState(cells)
                    }}
                  />
                }
              }}

              onChange={(code) => {
                setFirstCode(code)
                return true
              }} />
            <JSMirror code={secondCode}
              scope={{
                Toy: (props) => <Toy {...props} 
                  noRun={true}
                  cells={secondGameState}
                  setCells={(cells) => {
                      if (cells.length !== 0) {
                        setSecondColor(cells[0].color)
                      }
                    setSecondGameState(cells)
                  }}
                />
              }}
              onChange={(code) => {
                setSecondCode(code)
                return true
              }} />
          </>
        }
      />
    </div>
  )
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
        <AccountCreationReminder />
      </Level>
    </>
  )
}
/* Lindsey: Spaced repetition */
/*
Laurond: I have a character for you.. an individual who starts out in the lower caste and isn't considered creative or precise during childhood because their paintings and images make no sense to others, but then the *disruptive plot device event* causes them and a few others to be in a survival situation apart from the rest of the community, and nobody knows what to do, but the character has some ideas, and start learning how to communicate them instead of making the abstract art they used to make.
*/

export default Level2;