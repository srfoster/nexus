import React, { useEffect, useRef, useState } from 'react';
import { useLocalStorage, spread } from "../../../Util";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChatBubble from '../../Widgets/ChatBubble/';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FakeTeacherChip, NewMessageNotification, OpenedMessage, PleaseWaitWhileSockPuppetCreatesContent, SockPuppetChip} from '../../Widgets/NexusVoice';
import { JSMirror } from '../../Widgets/Educational';
import PianoSimulator from '../../Widgets/PianoSimulator.js';
import Typography from '@material-ui/core/Typography';

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
                      {React.createElement(PianoSimulator, spread(props, { activeNotes: notes }))}
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

function Puzzle4Piano(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-5", false)

  return (<>
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip /> is making video content!</span>,
        {
          text: <ChatBubble>My edutainment algorithms are still active.  I will now give you another educational mystery toy while we wait (again).</ChatBubble>,
          time: 3000
        },
        {
          text: <PianoSimulator />,
          time: 10000
        },
        {
          text: <ChatBubble>Please keep enjoying the toy...</ChatBubble>,
          time: 3000
        },
        {
          text: <ChatBubble>If you grow tired of the toy, here is a fun fact...</ChatBubble>,
          time: 3000
        },
        {
          text: <Card style={{ marginTop: 20, marginBottom: 20 }}>
            <CardContent>
              <Typography
                color="textSecondary" gutterBottom
              >Did you know...</Typography>

              In the current year, 2075, the Nexus provides 93.27% of all computer science education on the planet?
            </CardContent>
          </Card>,
          time: 5000
        },
        {
          text: <ChatBubble>If you grow tired of the previous fun fact, here is another one...</ChatBubble>,
          time: 3000
        },
        {
          text: <><Card style={{ marginTop: 20, marginBottom: 20 }}>
            <CardContent>
              <Typography
                color="textSecondary" gutterBottom
              >Did you know...</Typography>

              A small group of cyber-criminals known as "the Wizards" attempted to infiltrate the Nexus in the year 2063.  They were caught (and disciplined) by the Nexus's state of the art security algorithms.
            </CardContent>
          </Card></>,
          time: 10000
        },
      ]}
      SockPuppetMessage={React.createElement(SockPuppetsMessage4, props)}
    />

  </>)
}

export default Puzzle4Piano;