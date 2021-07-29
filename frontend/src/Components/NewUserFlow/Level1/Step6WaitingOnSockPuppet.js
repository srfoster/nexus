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
    from={<SockPuppetChip></SockPuppetChip>}
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
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-password-lesson-opened", false)

  return (
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <Typography paragraph><SockPuppetChip /><span>is making video content!</span></Typography>,
        <ChatBubble message={"While you wait, please know:"}></ChatBubble>,
        <ChatBubble message={"The Nexus prides itself in its educational content for magic users."}></ChatBubble>,
        <ChatBubble message={"At the Nexus, your educational experience is our highest priority."}></ChatBubble>,
        <ChatBubble message={"At the Nexus, our teachers are carefully chosen for their teaching prowess"}></ChatBubble>,
        <ChatBubble message={"and their ability to produce educational content"}></ChatBubble>,
        <ChatBubble message={"under strict deadlines"}></ChatBubble>,
        <ChatBubble message={"..."}></ChatBubble>,
        <ChatBubble message={<><span>Sometimes our low-level teachers, like</span> <SockPuppetChip /></>}></ChatBubble>,
        <ChatBubble message={"may not always meet the expected deadlines"}></ChatBubble>,
        <ChatBubble message={"that we strive for"}></ChatBubble>
      ].map(e => { return { text: e, time: 3000 } })}
      SockPuppetMessage={React.createElement(SockPuppetsMessage, props)}
    />
  )
}

export default Step6WaitingOnSockPuppet;