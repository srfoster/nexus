import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Snackbar from '@material-ui/core/Snackbar';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import AddBadgeOnRender from '../Badges/AddBadgeOnRender';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Fade from '@material-ui/core/Fade';
import Confetti from 'canvas-confetti';

export const withConfetti = (f) => {
  return (bool) => {
    if (bool) {
      Confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

    }
    f(bool)
  }
}

const ContinueButton = (props) => {
  return (
    <Fade in={true} timeout={1000}>
      <Button color="secondary" style={{ marginLeft: "auto", ...props.style }} onClick={props.onClick}>Next</Button>
    </Fade>
  );
}


export function LoginButton() {

  return (
    <a href="/login">
      <Button style={{ position: "fixed", bottom: 0, right: 0 }}>
        <ExitToAppIcon />
      </Button>
    </a>
  );
}


const Level = (props) => {
  return (
    <>
      <Card>
        <CardHeader title={"Level " + props.number + ""}
          subheader={props.subtitle}>
        </CardHeader>
        {props.children}
      </Card>
      
      <LoginButton/>
    </>
  );
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

export { Level, HintButton, ShowAfter, ContinueButton };
