import React, { useEffect, useState, useRef } from 'react';
import { useLocalStorage } from "../../../Util";
import ChatBubble from '../../Widgets/ChatBubble';
import Step7HelloWorldPuzzle from './Step7HelloWorldPuzzle';
import { NewMessageNotification, PleaseWaitWhileSockPuppetCreatesContent, SockPuppetChip } from '../../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';

function SockPuppetsMessage(props) {
  const [messageOpened, setMessageOpened] = useState(false)
  const openedMessage = useRef(null);

  useEffect(() => {
    if (openedMessage.current) { openedMessage.current.scrollIntoView() }
  }, [messageOpened])

  return (!messageOpened ? <NewMessageNotification
    nexusSays={"Wow!  New messages(s)..."}
    from={<SockPuppetChip level={1}></SockPuppetChip>}
    onOpenClicked={
      () => {
        setMessageOpened(true)
      }
    }
  /> :
    <div ref={openedMessage}>
      <Step7HelloWorldPuzzle setCanContinue={props.setCanContinue} username={props.username} />
    </div>
  )
}

function Step6WaitingOnSockPuppet(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("level-1-step-6-message-opened", false)

  return (
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip level={1}/> is making video content!</span>,
        <ChatBubble message={"Hello!"}></ChatBubble>,
        <ChatBubble message={"This is the Nexus speaking to you."}></ChatBubble>,
        <ChatBubble message={<><span>While we wait for</span> <SockPuppetChip level={1}/><span>, my edutainment algorithms will keep you entertained.</span></>}></ChatBubble>,
        <ChatBubble message={"Please note: I will communicate with you in short text messages, like these..."}></ChatBubble>,
        <ChatBubble message={"... because I know humans prefer short messages over walls of text."}></ChatBubble>,
        <ChatBubble message={"Also note: I normally wouldn't have to do this..."}></ChatBubble>,
        <ChatBubble message={<><span>... but</span> <SockPuppetChip level={1}/> <span>has been a slower-than-average video content producer.</span></>}></ChatBubble>,
        <ChatBubble message={"Oh! I know! I have a database of fun historical facts! I'm loading it now..."}></ChatBubble>,
        <ChatBubble message={"Here's the first fun historical fact..."}></ChatBubble>,
        <ChatBubble message={<><span>Ah! Nevermind.</span> <SockPuppetChip level={1}/> <span>just finished:</span></>}></ChatBubble>
      ].map(e => { return { text: e } })}
      SockPuppetMessage={React.createElement(SockPuppetsMessage, props)}
    />
  )
}

export default Step6WaitingOnSockPuppet;