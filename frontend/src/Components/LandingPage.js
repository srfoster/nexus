import React, { useEffect, useState } from 'react';
import { Switch, Route, Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import SignupForm from "./SignupForm";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Header from './Header';
import Snackbar from '@material-ui/core/Snackbar';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import useStyles from '../styles.js';
import ReactPlayer from 'react-player'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AddBadgeOnRender from './Badges/AddBadgeOnRender';

const GatewayVideo = (props) => {
  let history = useHistory();
  const classes = useStyles();
  const [showMakeAccount, setShowMakeAccount] = useState(false)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  return (
    <>
      {started ? "" :
        <ShowAfter seconds={{
          10: <p><strong>10 second hint:</strong> Try mousing over everything on the page...</p>,
          20: <p><strong>20 second hint:</strong> Try mousing over the question...</p>,
          30: <p><strong>30 second hint:</strong> OMG, just press the word "play"</p>,
          40: <p><strong>40 second hint:</strong> Not to be rude, but you seem a little slow...</p>,
          50: <p><strong>50 second hint:</strong> This isn't even a hint.  This is just an observation that you are not winning this game at the moment...</p>,
        }} />}

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card>
          <h2>Can you figure out how to
        <span style={{ cursor: "pointer" }}
              onClick={() => {
                setPlaying(!playing);
                setStarted(true);
                //setActiveStep(1)
              }}> {playing ? " pause " : " play "} </span>
           the video?</h2>
          <ReactPlayer
            url="https://codespells-org.s3.amazonaws.com/NexusVideos/e1.mp4"
            playing={playing}
            progressInterval={100}
            onProgress={(p) => {
              if (!showMakeAccount && p.playedSeconds >= 43) {
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
              {showMakeAccount ? <SignupForm
                history={history}
                showTopContent={false}
                signupButtonContent={"Make Account"}
              ></SignupForm> :
                  <Avatar className={classes.signupFormAvatar}>
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

const ShowAfter = (props) => {
  const [shown, setShown] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true

    Object.keys(props.seconds).map((k) => {
      setTimeout(() => {
        let value = props.seconds[k];
        if (mounted) {
          setShown(true);
          setMessage(value);
        }
      },
        k * 1000);
    })

    return () => {
      mounted = false
    }
  }, []);


  function GrowTransition(props) {
    return <Grow {...props} />;
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={shown}
      TransitionComponent={GrowTransition}>
      <Alert severity="info">{message}</Alert>
    </Snackbar>
  );
}

const HintButton = (props) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <>
      <p>
        <Button
          onClick={() => setShowHint(true)}>Hint</Button>
        {showHint ? props.hint : ""}</p>
    </>
  );
}

const Chapter = (props) => {
  return (
    <>
      <Card>
        <CardHeader title={"CodeSpells, the Story (Level " + props.number + ")"}
          subheader={props.subtitle}>
        </CardHeader>
        <CardContent>
          {props.children}
        </CardContent>
      </Card>
    </>
  );
}

const LandingPage = (props) => {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>CodeSpells Nexus</title>
        <meta name="description" content="Welcome to the Nexus! If you want to write and save spells that run on CodeSpells video games, you're in the right place." />
      </Helmet>
      {props.isLoggedIn ?
        <Chapter number={2} subtitle={"Beyond the gate"}>
          <AddBadgeOnRender name={"Reached:ch2:Beyond-the-Gate"} />
        </Chapter>
        :
        < Chapter number={1} subtitle={"At the threshold"}>
          <GatewayVideo />
        </Chapter>
      }
    </>
  );
}

export default LandingPage;