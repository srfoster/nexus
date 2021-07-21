import React, { useRef, useEffect, useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import { useLocalStorage } from "../../Util";
import ReactPlayer from 'react-player'
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { SockPuppetChip, FakeTeacherChip, StudentChip, NewMessageNotification, PleaseWaitWhileSockPuppetCreatesContent, OpenedMessage } from '../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';
import { SBS, Level, withConfetti } from './Level';
import CircularProgress from '@material-ui/core/CircularProgress';

//Questions we're asking (and answering) with our...
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
        to={<StudentChip name={props.username} level={2} />}
        subject={"A Whole New World!"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e3.mp4"
        text={
          <>
            hiiiii
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
        <span><SockPuppetChip level={2} /> welcomes you to his fork of the Nexus!<br/><br/></span>
      ]}
      SockPuppetMessage={<SockPuppetsMessage {...props} />}
    />
  )
}

function Page2(props) {
  
  return (<>
    <ul>
      <li>Page 2</li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    
  </>)
}

function Page3(props) {
  
  return (<>
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    
  </>)
}

function Page4(props) {
  
  return (<>
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    
  </>)
}

function Page5(props) {
  
  return (<>
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    
  </>)
}

export function Level3(props) {
  const [currentPart, setCurrentPart] = useLocalStorage("lvl3:currentPart", 0)
  const [canContinue, setCanContinue] = useState(false)
  
  let parts =
    [<Page1/>,
    <Page2/>,
    <Page3/>,
    <Page4/>,
    <Page5/>]

  return (
    <>
      <Level number={3} subtitle={"The Mission"}>
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
          <ContinueButton onClick={() => setCurrentPart(currentPart + 1)} />
        </CardActions>
      </Level>
    </>
  )
}

export default Level3;
