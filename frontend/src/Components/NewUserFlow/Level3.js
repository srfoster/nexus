import React, { useRef, useEffect, useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import { useLocalStorage } from "../../Util";
import ReactPlayer from 'react-player'
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { SockPuppetChip, FakeTeacherChip, StudentChip, NewMessageNotification } from '../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';
import { SBS, Level, withConfetti } from './Level';
import CircularProgress from '@material-ui/core/CircularProgress';


//FACTOR OUT OF LVL2 and 3
function PleaseWaitWhileSockPuppetCreatesContent(props) {
  var [step, setStep] = useState(props.contentComplete ? props.NexusStallingMessages.length : 0)

  useEffect(() => {

    if (!props.contentComplete) {
      let total = 0
      for (let i = 0; i < props.NexusStallingMessages.length; i++){
        let e = props.NexusStallingMessages[i]
        setTimeout(() => {
          if (i == props.NexusStallingMessages.length - 1) {
            setTimeout(()=>props.setContentComplete(true), (e.time || 2000))
          }
          setStep(i+1)
        },  total)

        total += (e.time || 2000)
      }
    }
  }, [])

  return (
    <>
      <div>
        {props.NexusStallingMessages.slice(0, step).map((e, i) => {
          let content = e.text || e
          return <div key={"content"+i}>{(typeof content == "string") ? (<Fade in={true}>
            <Typography paragraph>{content}</Typography>
          </Fade>)
            : content}</div>
        })}
      </div>
      { props.contentComplete ? props.SockPuppetMessage : <CircularProgress style={{ marginTop: 20 }} />}

    </>
  )
}
//FACTOR OUT OF LVL2 and 3
function OpenedMessage(props) {
  const [videoFinished,setVideoFinished] = useState(false) 

  return (<>
    <SBS
      leftSideTitle={<>
        <Typography component='span' paragraph>From {props.from} to {props.to} </Typography>
        <Typography>Subject: {props.subject}</Typography>
      </>}
      leftSide={
        <div style={{ backgroundColor: "black" }}>
          <ReactPlayer
            width={"100%"}
            url={props.videoUrl}
            controls={true}
            style={{}}
            progressInterval={100}
            onProgress={(p) => { }}
            onEnded={() => {
              setVideoFinished(true)
            }}
          />
        </div>
      }
      rightSide={!videoFinished ? "" : props.text }
    />
  </>)
}

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
