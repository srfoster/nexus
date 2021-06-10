import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Level, ShowAfter } from "./Level";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ReactPlayer from 'react-player'
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from '../../styles.js';
import SignupForm from '../../Components/SignupForm';

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
              {showMakeAccount ? <SignupForm
                history={history}
                showTopContent={false}
                signupButtonContent={"Make Account"}
              ></SignupForm> :
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

function Level1(props) {
    return(<Level setBadges={props.setBadges} number={1} subtitle={"At the threshold"}>
        <GatewayVideo />
    </Level>)
}

export default Level1