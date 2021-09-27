
import React, { useRef, useEffect, useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { useLocalStorage, spread } from "../../../Util";
import { SockPuppetChip, FakeTeacherChip, StudentChip, NewMessageNotification, PleaseWaitWhileSockPuppetCreatesContent, OpenedMessage, DidYouKnowCard } from '../../Widgets/NexusVoice';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChatBubble from '../../Widgets/ChatBubble';
import { MagicMirror } from '../../MagicMirror';
import CloseUIButton from '../../WorldWidgets/CloseUIButton';
import Alert from '@material-ui/lab/Alert';


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


function FadedExamplePuzzle(props){
    
}

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
        subject={"TBD"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e-3.1-smaller.ogv"
        text={
          <>
            <FadedExamplePuzzle/> 
          </>
        }
      />
    </div>
  )
}

function Page5(props){
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-3.5", false)

    return (<>
        <PleaseWaitWhileSockPuppetCreatesContent
            contentComplete={messageOpened}
            setContentComplete={setMessageOpened}
            NexusStallingMessages={
                [
                    <RuneDemo/>,
                    <span><SockPuppetChip level={3} /> reminds you that you are still in his fork of the Nexus!</span>,
                    {
                        text: <ChatBubble><Typography>Write content.</Typography></ChatBubble>,
                        time: 4000
                    },
                ]
            }

            SockPuppetMessage={
                <SockPuppetsMessage setCanContinue={props.setCanContinue}></SockPuppetsMessage>
            }
        />

    </>)
}

export default Page5;