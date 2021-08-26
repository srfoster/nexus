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
        <Typography paragraph><SockPuppetChip level={1}/><span> is making video content!</span></Typography>,
        <ChatBubble message={"Hello!"}></ChatBubble>,
        <ChatBubble message={"This is the Nexus speaking to you."}></ChatBubble>,
        <ChatBubble message={"My algorithms tell me that humans are entertained by short text messages"}></ChatBubble>,
        <ChatBubble message={"so I will share information with you in a concise format."}></ChatBubble>,
        <ChatBubble message={"The Nexus prides itself in its educational content for magic users."}></ChatBubble>,
        <ChatBubble message={"At the Nexus, your educational experience is our highest priority."}></ChatBubble>,
        <ChatBubble message={"At the Nexus, our teachers are carefully chosen for their teaching prowess"}></ChatBubble>,
        <ChatBubble message={"and their ability to produce educational content"}></ChatBubble>,
        <ChatBubble message={"under strict deadlines"}></ChatBubble>,
        <ChatBubble message={"..."}></ChatBubble>,
        <ChatBubble message={<span>Sometimes our low-level teachers, like <SockPuppetChip level={1}/></span>}></ChatBubble>,
        <ChatBubble message={"may not always meet the expected deadlines"}></ChatBubble>,
        <ChatBubble message={"that we strive for"}></ChatBubble>,
        <ChatBubble message={"Ah! Here we are:"}></ChatBubble>
      ].map(e => { return { text: e, time: 3000 } })}
      SockPuppetMessage={React.createElement(SockPuppetsMessage, props)}
    />
  )
}

export default Step6WaitingOnSockPuppet;