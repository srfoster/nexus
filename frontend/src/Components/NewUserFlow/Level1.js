import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Level, ShowAfter } from "./Level";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Fade from '@material-ui/core/Fade';
import ReactPlayer from 'react-player'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from '../../styles.js';
import SignupForm from '../../Components/SignupForm';


const MeetYourTeacher = (props) => {
  let [username, setUsername] = useState(undefined);
  let [password, setPassword] = useState(undefined);

  //Light Mage or Dark Mage Toggle

  function UserNameForm(props) {
    return(<div>
      <p>Input for username</p>
      <Button onClick={() => setUsername("Bob")}>Set Username</Button>
    </div>)
  }

  function WhyIsMyTeacherASock(props) {
    return(<div>
       <Typography color="textSecondary" gutterBottom>
          Why do you think your teacher is a sock?
        </Typography>
      <Typography variant="h5" component="h2">
        A. I am not worthy of having a non-sock teacher.
        </Typography>
      <Typography variant="h5" component="h2">
        B. Socks make the best teachers
        </Typography>
      <Typography variant="h5" component="h2">
        C. The Sock is not a teacher and cannot be trusted
        </Typography>
      <Typography variant="h5" component="h2">
        D. All of the above
        </Typography>
      <Typography variant="h5" component="h2">
        E. One of the above
        </Typography>
    </div>)
  }

  //Choose your username
  function ChooseYourUsername(props) {
    let [videoFinished, setVideoFinished] = useState(false);
    let [playing, setPlaying] = useState(false);

    return (
      <SBS
        leftSideTitle={<>
          <p>Congratulations, you've unlocked your first teacher!</p>
          <Button onClick={() => { setPlaying(true) }}>
            {playing ? "Pause" : "Play"} Video
            </Button>
        </>}
        leftSide={
          <>
            <ReactPlayer
              url="https://codespells-org.s3.amazonaws.com/NexusVideos/e1-sock-2.mp4"
              style={{}}
              playing={playing}
              onEnded={() => setVideoFinished(true)}
              progressInterval={100}
              onProgress={(p) => { }}
            />
          </>
        }
        rightSide={videoFinished ?
          <WhyIsMyTeacherASock /> : ""}
      />
    );
  }

  //Meet your teacher video/interaction
  function UsernameHasBeenChosen(props) {
    return (
      <>
        {password === undefined ? <SockPuppetPasswordRequester/> : <Level1CompleteScreen/>}
      </>
    );
  }

  function SockPuppetPasswordRequester(props) {
    return (
      <>
        <p>Video with sock puppet teaching you how to make a password.</p>
        <Button onClick={() => setPassword("SECUREpassword1!")}>Set Password</Button>
      </>
    );
  }
  
  function Level1CompleteScreen(props) {
    return (
      <>
        <p>Sock puppet video congratulating you and graduating you to story time level.</p>
        <Button onClick={() => { }}>Continue</Button>
      </>
    );
  }

  //Choose a password

  return (
    <>
      {username===undefined ? <ChooseYourUsername/> : <UsernameHasBeenChosen/> }
    </>
  );
 }

const SBS = (props) => {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card>
            <CardHeader title={
              <span style={{ fontSize: 16 }}>  
                {props.leftSideTitle}
              </span>
            }></CardHeader>
            { props.leftSide }
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card style={{ height: "100%" }}>
            <CardContent>
              {props.rightSide }
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>)
}

const GatewayVideo = (props) => {
  let history = useHistory();
  const classes = useStyles();
  const [showMakeAccount, setShowMakeAccount] = useState(false)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  let signupBit = []

  if (time >= 5) {
    signupBit = [< SignupForm
      history={history}
      showTopContent={false}
      signupButtonContent={"Make Account"}
    ></SignupForm>]
  }
  if (time >= 21) {
    signupBit = []
    signupBit.push(<Fade in={true} timeout={500}><h1>Hey...</h1></Fade>)
  }
  if (time >= 24) {
    signupBit.push(<h2>Yeah, you.</h2>)
  }
    
  if (time >= 29) {
    signupBit = []
    signupBit.push(<Fade in={true} timeout={500}><h1>Did you see that?</h1></Fade>)
  }

  if (time >= 30) {
    signupBit.push(<h2>Cool, huh?</h2>)
  }

  if (time >= 31) {
    signupBit.push(<h2>I can write stuff.</h2>)
  }

  if (time >= 32) {
    signupBit.push(<h2>Over on the side.</h2>)
  }

  if (time >= 37.5) {
    signupBit = []
  }

  if (time >= 38.5) {
    signupBit = [< SignupForm
      history={history}
      showTopContent={false}
      signupButtonContent={"Make Account"}
    ></SignupForm>]
  }

  if (time >= 45) {
    signupBit.unshift(<h3 style={{textAlign: "center"}}>(Please)</h3>)
  }

  return (
    <>
      {started ? "" :
        <ShowAfter seconds={{
          10: <p><strong>10 second hint:</strong> Having trouble? Try mousing over everything on the page!</p>,
          20: <p><strong>20 second hint:</strong> Try mousing over the question!</p>,
          30: <p><strong>30 second hint:</strong> What if you press the word "play"?</p>,
          40: <p><strong>40 second hint:</strong> Maybe you walked away from the computer? Rude!</p>,
          50: <p><strong>50 second hint:</strong> This isn't even a hint.  This is just an observation that you are not winning this game at the moment...</p>,
          60: <p><strong>1 minute hint:</strong> If you want to move forward, do me a favor and just click on the word "play" in the question below!</p>,
        }} />}

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card>
            <CardHeader title={
              <span style={{fontSize: 16}}> Can you figure out how to
        <span style={{ cursor: "pointer" }}
                  onClick={() => {
                    setPlaying(!playing);
                    setStarted(true);
                    //setActiveStep(1)
                  }}> {playing ? " pause " : " play "} </span>
           the video?</span>}></CardHeader>
            <ReactPlayer
              url="https://codespells-org.s3.amazonaws.com/NexusVideos/e1-sock.mp4"
              style={{
    "transform": "rotateY(180deg)",
    "-webkit-transform": "rotateY(180deg)",
    "-moz-transform": "rotateY(180deg)"
}}
              playing={playing}
              progressInterval={100}
              onProgress={(p) => {
                setTime(p.playedSeconds)
                if (!showMakeAccount && p.playedSeconds >= 5) {
                  setShowMakeAccount(true)
                  setActiveStep(activeStep + 1)
                }
              }}
            />
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card style={{height: "100%"}}>
            <CardContent>
              {showMakeAccount ? signupBit :
                <Avatar
                  onClick={(e) => {
                    if(e.ctrlKey)
                      setShowMakeAccount(true)
                  }}
                  className={classes.signupFormAvatar}>
                    <LockOutlinedIcon />
                  </Avatar>
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

/* Character Creation Mode
Toggle: Choose Light or Dark Mage
Choose a unique Wizard name (acct name) -> tell you if name is already taken
MEET YOUR TEACHER! (Googly eye sock puppet)
First law of magic: Choose a secret name (mini password lesson, special character and number)

      <ul>
        <li>Goal of our THING</li>
        <li>THING: Edutainment experience</li>
        <li>Why it's valuable to you</li>
        <li>Why we're doing it</li>
        <li>Create an account to continue</li>
      </ul>
*/
function Level1(props) {
    return(<Level setBadges={props.setBadges} number={1} subtitle={"At the threshold"}>
      <MeetYourTeacher />
    </Level>)
}

export default Level1