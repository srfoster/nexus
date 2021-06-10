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
  let [darkMode, setDarkMode] = useState(undefined);
  let [username, setUsername] = useState(undefined);
  let [password, setPassword] = useState(undefined);

  //Light Mage or Dark Mage Toggle

  function LightOrDark(props) {
    return(<div>
      <p>Light or dark</p>
      <Button onClick={() => setDarkMode(!darkMode)}>Toggle</Button>
    </div>)
  }

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
  function SockPuppetPasswordRequester(props) {
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
          <><WhyIsMyTeacherASock />
            <Button onClick={() => setPassword("SECUREpassword1!")}>Set Password</Button>
          </> : ""}
      />
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
      {darkMode === undefined ? <LightOrDark /> :
        (username === undefined ? <UserNameForm /> :
          (password === undefined ? <SockPuppetPasswordRequester />
            : <Level1CompleteScreen/>
          ))}
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

/* Character Creation Mode
Toggle: Choose Light or Dark Mage
Choose a unique Wizard name (acct name) -> tell you if name is already taken
MEET YOUR TEACHER! (Googly eye sock puppet)
First law of magic: Choose a secret name (mini password lesson, special character and number)
*/
function Level1(props) {
    return(<Level setBadges={props.setBadges} number={1} subtitle={"Character creation"}>
      <MeetYourTeacher />
    </Level>)
}

export default Level1