import { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import ChatBubble from './ChatBubble';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import MailIcon from '@material-ui/icons/Mail';
import ReactPlayer from 'react-player'
import SchoolIcon from '@material-ui/icons/School';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import IconButton from "@material-ui/core/IconButton";



export const VideoAndPuzzleLayout = (props) => {
  return (
    <>
      <Card elevation={4}>
        <CardHeader title={
          <span style={{ fontSize: 16 }}>
            {props.leftSideTitle}
          </span>
        }></CardHeader>
        {props.leftSide}
      </Card>
      <Card style={{ height: "100%" }}>
        <CardContent>
          {props.rightSide}
        </CardContent>
      </Card>
    </>)
}


export function NewMessageNotification(props) {
  return(<Grid container spacing={1}>
    <Fade in={true} timeout={1000}>
      <Grid item xs={6}>
        <Typography>
          {props.nexusSays}
        </Typography>
      </Grid>
    </Fade>
    <Fade in={true} timeout={2000}>
      <Grid item xs={6}>
        <Badge badgeContent={1} color="secondary">
          <MailIcon />
        </Badge>
        <Typography>from</Typography>
        {props.from}
        <Button size="small" onClick={ ()=>props.onOpenClicked() }>Open?</Button>
      </Grid>
    </Fade>
  </Grid>)
}

export function SockPuppetChip(props) {
  return <Chip avatar={<Avatar alt="Sock Puppet"><SchoolIcon/></Avatar>} label={"Sock Puppet (Teacher Lvl " + (props.level !== undefined ? props.level : "undefined") + ")"}></Chip>
}

export function NexusDevsChip() {
  return <Chip avatar={<Avatar alt="Nexus Devs"><SchoolIcon/></Avatar>} label="Nexus Devs (Teacher Lvl 99)"></Chip>
}

export function StudentChip(props) {
  return <Chip avatar={<Avatar alt={props.name}/>} label={<span>{props.name} {" (Student Lvl " + (props.level !== undefined ? props.level : 10 * props.name.length) + ")"}</span>}></Chip>
}

export function FakeTeacherChip(props) {
  return <Chip avatar={<Avatar alt={props.name}><SchoolIcon/></Avatar>} label={<span>{props.name} {" (Lvl " + (props.level !== undefined ? props.level : 10 * props.name.length) + ")"}</span>}></Chip>
}
 
export function SpinThen(props) {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setTimeout(() => { setShowFeedback(true) } ,props.spinTime)
  }, [])

  return (
    <>
      {showFeedback ? props.children : <CircularProgress></CircularProgress>}
    </>
  );
}

export function PleaseWaitWhileSockPuppetCreatesContent(props) {
  var [step, setStep] = useState(props.contentComplete ? props.NexusStallingMessages.length : 0)

  // Takes NexusStallingMessage (like a ChatBubble or Typography), 
  // checks the number of words in content
  // translates # of words into # of milliseconds (~180 words / min)
    // Won't work for ALL elements, so user can still 
    // set time prop for NexusStallingMessage
  function waitTimeForReading(content){
    let extraTime = 1000; //A little extra buffer time for reader to see there's a new message
    // if the content isn't an object with a text key
    let waitTime;
    if(!content.text) {
      waitTime = 3000;
      return waitTime;
    }
    //if the content is a chat bubble w/ a child (that's the message)
    if(content.text.props.children && typeof content.text.props.children == "string"){
      waitTime = content.text.props.children.split(" ").length / 180 * 60 * 1000 + extraTime;
      //console.log(waitTime);
      return waitTime;
    }
    //if the content is a chat bubble w/ a message prop
    else if(content.text.props.message && typeof content.text.props.message == "string"){
      waitTime = content.text.props.message.split(" ").length / 180 * 60 * 1000 + extraTime;
      //console.log(waitTime)
      return waitTime;
    }
    else{ // defaults to 3000 for everything else
      waitTime = 3000;
      return waitTime;
    } 
  }

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

        total += (e.time || waitTimeForReading(e))
      }
    }
  }, [])

  return (
    <>
      <div>
        {props.NexusStallingMessages.slice(0, step).map((e, i) => {
          let content = e.text || e
          return <div key={"content"+i}>{(typeof content == "string") ? (<Fade in={true}>
            {content}
          </Fade>)
            : content}</div>
        })}
      </div>
      { props.contentComplete ? props.SockPuppetMessage : <ChatBubble><CircularProgress style={{ width: 20, height: 20 }} /></ChatBubble>}

    </>
  )
}

export function OpenedMessage(props) {
  const [videoFinished,setVideoFinished] = useState(false)
  
  return (<>
    <VideoAndPuzzleLayout
      leftSideTitle={<>
        <Grid container spacing={1}>
          <Grid item xs={2}><Typography><strong>From:</strong></Typography></Grid>
          <Grid item xs={10}>{props.from}</Grid>
          <Grid item xs={2}><Typography><strong>To:</strong></Typography></Grid>
          <Grid item xs={10}>{props.to}</Grid>
          <Grid item xs={2}><Typography><strong>Subject:</strong></Typography></Grid>
          <Grid item xs={10}><Typography>{props.subject}</Typography></Grid>
        </Grid>
      </>}
      leftSide={
        <CustomVideoPlayer
          videoUrl={props.videoUrl}
          setVideoFinished={setVideoFinished} />
      }
      rightSide={!videoFinished ? "" : props.text }
    />
  </>)
}

function CustomVideoPlayer(props) {
  const [playing, setPlaying] = useState(false)

  const handlePlayPause = () => {
    console.log("Playing video now")
    setPlaying(!playing);
  }

  return (
    <>
      <div style={{ backgroundColor: "black" }}>
        <ReactPlayer
          width={"100%"}
          url={props.videoUrl}
          controls={false}
          playing={playing}
          style={{}}
          progressInterval={100}
          onProgress={(p) => { }}
          onEnded={() => {
            props.setVideoFinished(true)
          }}
        />
        <PlayerControls
          onPlayPause={handlePlayPause}
          playing={playing}
        />
      </div>
    </>
  )

}

function PlayerControls({ onPlayPause, playing }) {

  return (<>
    <IconButton
      onClick={onPlayPause}
      aria-label="play"
    >
      {playing ? (
        <PauseIcon fontSize="inherit" />
      ) : (
        <PlayArrowIcon fontSize="inherit" />
      )}
    </IconButton>
  </>)
}