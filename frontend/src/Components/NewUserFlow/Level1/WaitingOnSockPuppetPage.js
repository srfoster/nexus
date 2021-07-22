import React, { useEffect, useState } from 'react';
import { useLocalStorage } from "../../../Util";
import ChatBubble from '../../Widgets/ChatBubble/';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import HelloWorldPuzzle from './HelloWorldPuzzle';
import { NewMessageNotification, SockPuppetChip } from '../../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';

function WaitingOnSockPuppetPage(props) {
  var [step, setStep] = useState(0)
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-password-lesson-opened", false)

  useEffect(() => {
    if (!messageOpened) {
      setTimeout(() => setStep(1), 1000)
      setTimeout(() => setStep(2), 3000)
      setTimeout(() => setStep(3), 6000)
      setTimeout(() => setStep(4), 9000)
      setTimeout(() => setStep(5), 12000)
      setTimeout(() => setStep(6), 15000)
      setTimeout(() => setStep(7), 18000)
      setTimeout(() => setStep(8), 21000)
      setTimeout(() => setStep(9), 24000)
      setTimeout(() => setStep(10), 27000)
      setTimeout(() => setStep(11), 30000)
      setTimeout(() => setStep(12), 33000)
      setTimeout(() => setStep(13), 36000)
      setTimeout(() => setStep(14), 39000)
    }
  }, [])

  return (!messageOpened ? <div>
    {step >= 1 ?
      <Typography paragraph><SockPuppetChip /><span>is making video content!</span></Typography>
      : ""}
    {step >= 2 ?
      <Fade in={true}>
        <ChatBubble message={"While you wait, please know:"}></ChatBubble></Fade> 
        : ""}
    {step >= 3 ?
      <Fade in={true} timeout={500}>
        <ChatBubble message={"The Nexus prides itself in its educational content for magic users."}></ChatBubble>
      </Fade>
      : ""}
    {step >= 4 ?
      <Fade in={true} timeout={500}>
        <ChatBubble message={"At the Nexus, your educational experience is our highest priority."}></ChatBubble>
      </Fade>
      : ""}
    {step >= 5 ?
      <Fade in={true} timeout={500}>
        <ChatBubble message={"At the Nexus, our teachers are carefully chosen for their teaching prowess"}></ChatBubble>
      </Fade>
      : ""}
    {step >= 6 ?
      <Fade in={true} timeout={500}>
        <ChatBubble message={"and their ability to produce educational content"}></ChatBubble>
      </Fade>
      : ""}
    {step >= 7 ?
      <Fade in={true} timeout={500}>
        <ChatBubble message={"under strict deadlines"}></ChatBubble>
      </Fade>
      : ""}
    {step >= 8 ?
      <ChatBubble message={"..."}></ChatBubble> 
      : ""}
    {step >= 9 ?
      <ChatBubble message={<><span>Sometimes our low-level teachers, like</span> <SockPuppetChip /></>}></ChatBubble> 
      : ""}
    {step >= 10 ?
      <ChatBubble message={"may not always meet the expected deadlines"}></ChatBubble> 
      : ""}
    {step >= 11 ?
      <ChatBubble message={"that we strive for"}></ChatBubble> 
      : ""}
    {step >= 12 ?
      <NewMessageNotification
        nexusSays={"Ah, here we go!"}
        from={<SockPuppetChip />}
        onOpenClicked={() => { setMessageOpened(true) }}/> 
      : ""}
    {step < 13 ? 
      <ChatBubble message={<CircularProgress style={{width:20, height:20}}></CircularProgress>}></ChatBubble> 
      : ""}
  </div> 
  : <HelloWorldPuzzle setCanContinue={props.setCanContinue} username={props.username} />
  )
}

export default WaitingOnSockPuppetPage;