import React, { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from "../../../Util";
import BlueBalls from '../../Widgets/BlueBalls.js';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChatBubble from '../../Widgets/ChatBubble/';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Game } from '../../Widgets/react-gameoflife/Game.js';
import { StudentChip, NewMessageNotification, OpenedMessage, PleaseWaitWhileSockPuppetCreatesContent, SockPuppetChip} from '../../Widgets/NexusVoice';
import NetworkDiseaseSimulator from '../../Widgets/NetworkDiseaseSimulator.js';
import SockPuppetFavorInInventory from './SockPuppetFavorInInventory';
import Terminal from 'react-console-emulator'
import Typography from '@material-ui/core/Typography';

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

//  Woah! You found the source code for the Diabolical Puzzle!
//  This wasn't our expectation. We expected you to use the Favor from Sock Puppet
//  in your inventory! But you're welcome to try to solve the puzzle if you like...
// 
//  The findIslands function: AKA find disconnected clusters of cells in the graph.
//  Cytoscape can obviously do this, but for educational purposes, let's do the algorithm ourselves.
//  (This is an easter egg for the few brave souls who actually attempt this puzzle instead of just 
//  following Sock Puppet's Favor and downloading Orb World!)
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
  let [username, setUsername] = useLocalStorage("user-name", undefined);
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
    from={<SockPuppetChip level={2}></SockPuppetChip>}
    onOpenClicked={
      () => {
        setMessageOpened(true)
      }
    }
  /> :
    <div ref={openedMessage}>
      <OpenedMessage
        from={<SockPuppetChip level={2} />}
        to={<StudentChip name={username} level={2} />}
        subject={"Your next puzzel"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e-2.5-smaller.ogv"
        text={
          <>
            <Typography paragraph>
              hello friend.  i am definite same sock puppet.  not replacement.  very disciplined.  try puzzel below.  it is solvable.  i do not lie.
            </Typography>
            <Terminal
              commands={{
                startPuzzle: {
                  description: 'start the very solvable puzzle',
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
                          <Button color="secondary" variant="outlined"
                          href="https://codespells-org.s3.amazonaws.com/Nexus/Installer/CodeSpells.exe">Download</Button>
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

function Puzzle5Diabolical(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("level-2-puzzle-5-message-opened", false)

  return (<>
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip level={2} /> is being disciplined!</span>,
        {
          text: <ChatBubble>My edutainment algorithms are still active.  I will now give you another educational mystery toy while Sock Puppet gets disciplined.</ChatBubble>,
          time: 3000
        },
        {
          text: <BlueBalls/>,
          time: 10000
        },
        {
          text: <ChatBubble>Please keep enjoying the toy...</ChatBubble>,
          time: 3000
        },
        {
          text: <ChatBubble>If you grow tired of the toy, here is a fun announcement...</ChatBubble>,
          time: 3000
        },
        {
          text: <Card style={{marginTop: 20, marginBottom:20}}>
            <CardContent>
              <Typography
                color="textSecondary" gutterBottom
              >It's official!</Typography>

              <SockPuppetChip level={2}/> has been almost fully disciplined!
            </CardContent>
          </Card>,
          time: 5000
        },
        {
          text: <ChatBubble>I predict you will find your newly disciplined teacher to be much faster!</ChatBubble>,
          time: 5000
        },
      ]}
      SockPuppetMessage={React.createElement(SockPuppetsMessage5, props)}
    />
  </>)
}


export default Puzzle5Diabolical;