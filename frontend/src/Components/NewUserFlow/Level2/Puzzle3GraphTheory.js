import React, { useEffect, useRef, useState } from 'react';
import { useLocalStorage, spread } from "../../../Util";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChatBubble from '../../Widgets/ChatBubble/';
import CircularProgress from '@material-ui/core/CircularProgress';
import { JSMirror } from '../../Widgets/Educational';
import { StudentChip, NewMessageNotification, OpenedMessage, PleaseWaitWhileSockPuppetCreatesContent, SockPuppetChip} from '../../Widgets/NexusVoice';
import NetworkDiseaseSimulator from '../../Widgets/NetworkDiseaseSimulator.js';
import Typography from '@material-ui/core/Typography';


function SockPuppetsMessage3(props) {
  const [messageOpened, setMessageOpened] = useState(false);
  const openedMessage = useRef(null);
  let [username, setUsername] = useLocalStorage("user-name", undefined);
  const [code, setCode] = useState("<Toy\n  nodes={['You!','Sock Puppet']}\n  edges={[['You!','Sock Puppet']]}\n  patientZero={'Sock Puppet'}/>");

  const setCanContinue = props.setCanContinue

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
        subject={"Introduction to Networks"}
        videoUrl="https://d37uis87scphnk.cloudfront.net/NexusVideos/e-2.3-smaller.ogv"
        text={
          <>
            <Typography paragraph>
              The Puzzle is to make someone named John sick on the 5th day.  There are many solutions.  (But there are also many wrong answers.  I'm sorry.  I had to make it hard...)
            </Typography>
            <Typography paragraph>
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
                    {showSimulator ?
                      React.createElement(NetworkDiseaseSimulator,
                        spread(props, {
                          onChange: (data) => {
                            if (data.explored.indexOf("easteregg") >= 0 || (data.explored.indexOf("John") >= 0 && data.iteration == 5)) setCanContinue(true)
                          }
                        })) :
                      <Card style={{ height: "525px" }}><CardContent><CircularProgress /></CardContent></Card>
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


function Puzzle3GraphTheory(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("level-2-puzzle-3-message-opened", false)

  return (<>
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip level={2} /> is making video content!</span>,
        {
          text: <ChatBubble>My edutainment algorithms are still active.  I will now give you another educational mystery toy to make your teacher's tardiness more enjoyable.</ChatBubble>,
        },
        {
          text: <NetworkDiseaseSimulator
            nodes={["woogachaka", "fastsnake", "laurond", "kenzo", "that_onion", "cringelord713", "Sock Puppet", "You!"]}
            edges={[["Sock Puppet", "You!"], ["laurond", "kenzo"], ["kenzo", "fastsnake"], ["kenzo", "cringelord713"], ["cringelord713", "that_onion"], ["that_onion", "woogachaka"], ["that_onion", "Sock Puppet"]]}
            patientZero={ "laurond" }
          />,
          time: 10000
        },
        {
          text: <ChatBubble>Please keep enjoying the toy...</ChatBubble>,
          time: 10000
        },
      ]}
      SockPuppetMessage={ React.createElement(SockPuppetsMessage3, props) }
    />

  </>)
}

export default Puzzle3GraphTheory;