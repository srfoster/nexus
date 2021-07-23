import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Fade from '@material-ui/core/Fade';
import Confetti from 'canvas-confetti';
import SpellsApiService from '../../Services/spells-api-service';
import SignupForm from '../SignupForm';
import Hidden from '@material-ui/core/Hidden';
import Modal from '@material-ui/core/Modal';
import LoginForm from '../LoginForm';

// Every component from this file is exported!

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

export const ContinueButton = (props) => {
  return (
    <Fade in={true} timeout={1000}>
      <Button
        color="secondary"
        style={{ marginLeft: "auto", ...props.style }}
        onClick={props.onClick}>Next</Button>
    </Fade>
  );
}

export const LoginButton = () => {

  return (
    <a href="/login">
      <Button style={{ position: "fixed", bottom: 0, right: 0 }}>
        <ExitToAppIcon />
      </Button>
    </a>
  );
}


export const Level = (props) => {
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

export const ShowAfter = (props) => {
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

export const HintButton = (props) => {
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

export const AccountCreationReminder = (props) => {
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);

  useEffect(() => {
    // Only running this to check if logged in
    let promise_or_false = SpellsApiService.getUserById('me')
    if (promise_or_false) {
      promise_or_false
        .then((user) => setIsLoggedIn(true))
        .catch(() => setIsLoggedIn(false))
    }
  })

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modalBody = (
    <div style={modalStyle} className={classes.paper}>
      <Grid container
        spacing={1}
        direction="row"
        alignItems="center"
        justify="center">
        <Grid item lg={5} >
          <SignupForm showSigninMessage={false} />
        </Grid>
        <Hidden mdDown>
          <Grid item lg={2} >
            <Typography variant="h5" align="center">— OR —</Typography>
          </Grid>
        </Hidden>
        <Hidden lgUp>
          <Grid item lg={2} >
            <Typography align="center">Or if you already have an account...</Typography>
          </Grid>
        </Hidden>
        <Grid item lg={5} >
          <LoginForm showSignupMessage={false} />
        </Grid>
      </Grid>

    </div>
  );

  function AccountCreationOrLoginModal(props) {
    return (
      <>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {modalBody}
        </Modal>
      </>
    )
  }

  return (
    <>
      {isLoggedIn ? "" :
        <Paper square={true} style={{ background: "#f50057", opacity: 0.8 }}>
          <Box pl={3} pr={3} pt={1} pb={1}>
            <Typography style={{ color: "white" }}>
              Oh no! We can't save your progress!
            </Typography>
            <Typography style={{ color: "white" }}>
              <a onClick={handleOpen}><strong><span style={{ textDecoration: "underline", color: "white" }}>Create an account or login</span></strong></a>. You will return where you left off.
            </Typography>
            <AccountCreationOrLoginModal />
          </Box>
        </Paper>
      }

    </>
  )
}