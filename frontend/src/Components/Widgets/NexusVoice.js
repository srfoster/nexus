import { useState, useEffect, useRef } from 'react';
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
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

import Tooltip from "@material-ui/core/Tooltip";

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
        <SimpleVideoPlayer
          videoUrl={props.videoUrl}
          setVideoFinished={setVideoFinished} />
      }
      rightSide={!videoFinished ? "" : props.text }
    />
  </>)
}

function SimpleVideoPlayer(props) {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false)

  const [state, setState] = useState({
    played: 0,
    duration: 0,
    seeking: false,
  });

  const format = (sec) => {
    if(isNaN(sec)){
      return '00:00'
    }

    const date = new Date(sec * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2,"0")
    if(hh){
      return `${hh}:${mm.toString().padStart(2,"0")}:${ss}`
    }

    return `${mm}:${ss}`
  }

  const handlePlayPause = () => {
    console.log("Playing video now")
    setPlaying(!playing);
  }

  const handleProgress = (changeState) => {
    console.log(changeState)
    if(!state.seeking){
      setState({ ...state, ...changeState })
    }
  }

  const handleSeekChange = (e, newVal) => {
    setState({...state, played: parseFloat(newVal / 100)})
  }

  const handleSeekMouseDown = (e) => {
    setState({...state, seeking:true})
  }

  const handleSeekMouseUp = (e, newVal) => {
    setState({...state, seeking: false})
    playerRef.current.seekTo(newVal / 100)
  }

  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00'
  const duration = playerRef.current? playerRef.current.getDuration() : '00:00'
  const elapsedTime = format(currentTime)
  const totalDuration = format(duration)

  return (
    <>
      <div style={{ backgroundColor: "black" }}>
        <ReactPlayer
          ref={playerRef}
          width={"100%"}
          url={props.videoUrl}
          controls={false}
          playing={playing}
          style={{}}
          progressInterval={100}
          onProgress={handleProgress}
          onEnded={() => {
            props.setVideoFinished(true)
          }}
        />
        <PlayerControls
          onPlayPause={handlePlayPause}
          playing={playing}
          played={state.played}
          onSeek={handleSeekChange}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
        />
      </div>
    </>
  )

}

  const useStyles = makeStyles((theme) => ({
    controlIcons: {
      color: "#777",

      fontSize: 50,
      transform: "scale(0.9)",
      "&:hover": {
        color: "#fff",
        transform: "scale(1)",
      },
    }
  }))
function PlayerControls({ onPlayPause, playing, played, onSeek, onSeekMouseDown, onSeekMouseUp, elapsedTime, totalDuration }) {
  const classes = useStyles();


  return (<>
    <div style={{ paddingRight: 20 }}>
      <Grid container direction="row">
        <Grid item xs={2}>
          <IconButton
            onClick={onPlayPause}
            className={classes.controlIcons}
            aria-label="play"
          >
            {playing ? (
              <PauseIcon fontSize="inherit" />
            ) : (
              <PlayArrowIcon fontSize="inherit" />
            )}
          </IconButton>
        </Grid>
        <Grid item xs={10} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <PrettoSlider
            min={0}
            max={100}
            value={played * 100}
            ValueLabelComponent={(props) => <ValueLabelComponent {...props} value={elapsedTime} />}
            onChange={onSeek}
            onMouseDown={onSeekMouseDown}
            onChangeCommitted={onSeekMouseUp}
          />
        </Grid>
        {/* 
      If we want to show elapsed time over total duration...
      <Typography>{elapsedTime}/{totalDuration}</Typography> */}
      </Grid>
    </div>
  </>)
}


const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}