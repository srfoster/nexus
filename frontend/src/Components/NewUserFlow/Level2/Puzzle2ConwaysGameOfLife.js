import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage, spread } from "../../../Util";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CasinoIcon from '@material-ui/icons/Casino';
import ChatBubble from '../../Widgets/ChatBubble/';
import { Game } from '../../Widgets/react-gameoflife/Game.js';
import { JSMirror } from '../../Widgets/Educational';
import { OpenedMessage, NewMessageNotification, PleaseWaitWhileSockPuppetCreatesContent, SockPuppetChip, StudentChip} from '../../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';

const SockPuppetsMessage2 = (props) => {
  const [messageOpened, setMessageOpened] = useState(false)
  const openedMessage = useRef(null);

  let Toy = (props) => {

    return React.createElement(Game, spread(props, {
      setCells:
        (cells) => { props.setCells(cells) }}))
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
        subject={"Simulations are Fun!"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/2.2.mp4"
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
                  Alter the Spell for each Toy so that the color properties are <tt style={{ color: "#FF1493" }}><span> #FF1493 </span></tt> and <tt style={{ color: "#00BFFF" }}>#00BFFF</tt>.
                </Typography>
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
                  return React.createElement(Toy, spread(props, {
                    noRun: true,
                    cells: firstGameState,
                    setCells: (cells) => {
                      if (cells.length !== 0) {
                        setFirstColor(cells[0].color)
                      }
                      setFirstGameState(cells)
                    }
                  }))
                }
              }}

              onChange={(code) => {
                setFirstCode(code)
                return true
              }} />
            <JSMirror code={secondCode}
              scope={{
                Toy: (props) =>
                  React.createElement(Toy, spread(props,
                    {
                      noRun: true,
                      cells: secondGameState,
                      setCells: (cells) => {
                        if (cells.length !== 0) {
                          setSecondColor(cells[0].color)
                        }
                        setSecondGameState(cells)
                      }
                    }))
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


function Puzzle2ConwaysGameOfLife(props) {  
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-3", false)

  return (
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip /> is making video content!</span>,
        {
          text: <ChatBubble>My entertainment algorithms tell me that humans like to play with toys.</ChatBubble>,
          time: 3000
        },
        {
          text: <ChatBubble>Here is a toy...</ChatBubble>,
          time: 1000
        },
        {
          text: <><Game /></>,
          time: 10000
        },
        {
          text: <ChatBubble>I hope you are enjoying the toy...</ChatBubble>,
          time: 10000
        },
        {
          text: <ChatBubble>Please continue enjoying the toy.</ChatBubble>,
          time: 10000
        }
      ]}
      SockPuppetMessage={React.createElement(SockPuppetsMessage2, props)}
    />
  )
}

export default Puzzle2ConwaysGameOfLife;