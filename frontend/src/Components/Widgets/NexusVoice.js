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

export const VideoAndPuzzleLayout = (props) => {
  return (
    <>
      <Card>
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
    if(!content.text) {
      return 3000
    }
    //if the content is a chat bubble w/ a child (that's the message)
    if(content.text.props.children && typeof content.text.props.children == "string"){
      return content.text.props.children.split(" ").length / 180 * 60 * 1000 + extraTime
    }
    //if the content is a chat bubble w/ a message prop
    else if(content.text.props.message && typeof content.text.props.message == "string"){
      return content.text.props.message.split(" ").length / 180 * 60 * 1000 + extraTime
    }

    else{ // defaults to 3000 for everything else
      return 3000;
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
        <Grid container spacing={0.5}>
          <Grid item xs={2}><Typography paragraph><strong>From:</strong></Typography></Grid>
          <Grid item xs={10}><Typography paragraph>{props.from}</Typography></Grid>
          <Grid item xs={2}><Typography paragraph><strong>To:</strong></Typography></Grid>
          <Grid item xs={10}><Typography paragraph>{props.to}</Typography></Grid>
          <Grid item xs={2}><Typography paragraph><strong>Subject:</strong></Typography></Grid>
          <Grid item xs={10}><Typography paragraph>{props.subject}</Typography></Grid>
        </Grid>
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
