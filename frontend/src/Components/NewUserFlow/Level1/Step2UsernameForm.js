import React, { useEffect, useState } from 'react';
import { useLocalStorage } from "../../../Util";
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

function Step2UsernameForm(props) {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useLocalStorage("user-name-available", undefined);
  const [username, setUsernameLocal] = useState(props.username);

  useEffect(() => {
    if (username && available) {
      props.setCanContinue(true)
    }
  }, [])

  function checkAvailability() {
    setChecking(true)

    //Would do network call here...
    setTimeout(() => {
      setChecking(false)
      setAvailable(true)

      //Causing annoying re-render...
      props.setUsername(username);
      props.setCanContinue(true)
    }, 1000)
  }

  function OneMoment(props) {
    return (
      <Typography>One moment...</Typography>
    )
  }

  function UsernameInput() {

    function handleKeyUp(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("availabilityButton").click();
      }
    }

    return (
      available ?
        <>
          <Typography>Welcome,</Typography>
          <Chip avatar={<AccountCircle />}
            label={username} />
        </>
        : (
          <>
            <TextField
              id="inputField"
              autoFocus
              onKeyUp={handleKeyUp}
              onChange={(e) =>
                setUsernameLocal(e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </>
        )
    )
  }

  return (<Grid container spacing={1}>
    <Fade in={true} timeout={1000}>
      <Grid item xs={6} >
        <Typography>At the Nexus, you are a user of magic. What shall we call you?</Typography>
      </Grid>
    </Fade>
    <Fade in={true} timeout={5000}>
      <Grid item xs={6}>
        {checking ? OneMoment() : UsernameInput()}

        {username === undefined || checking ? "" :
          <Fade key="check-available" in={true} timeout={1000}>
            <Button size="small" id="availabilityButton" onClick={() => {
              if (!available) {
                checkAvailability()
              } else {
                setAvailable(undefined)
                props.setCanContinue(false)
              }
            }
            }>{!available ? "Check Availability" : "Undo?"}</Button>
          </Fade>}
      </Grid>
    </Fade>
  </Grid>)
}

export default Step2UsernameForm;