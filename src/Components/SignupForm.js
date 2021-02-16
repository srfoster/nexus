import React, { useEffect, useState } from 'react';
import AuthApiService from '../Services/auth-api-service';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const SignupForm = (props) => {
  const classes = useStyles();
  const paper = formPaper();

  let usernameInput = React.createRef()
  let passwordInput = React.createRef()
  let passConfirmInput = React.createRef()

  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault()
    // const { username, password, passwordVerify } = e.target;

    if(passwordInput.current.value !== passConfirmInput.current.value){
      setError("Password do not match");
      return;
    }

    AuthApiService.postUser({
      username: usernameInput.current.value,
      password: passwordInput.current.value,
    })
      .then(user => {
        // console.log("New user submitted");
        usernameInput.current.value = ''
        passwordInput.current.value = ''
        passConfirmInput.current.value = ''
        handleSignupSuccess()
      })
      .catch(res => {
        setError(res.error);
      })
    }
  
    const handleSignupSuccess = () => {
      const { history } = props
      history.push('/spells')
      // if(props.onLogin){
      //   props.onLogin(true);
      // }
    }

    return (
    <>
    <h1>Create Account</h1>
    <div className={paper.root}>
      
      <Paper>
        <div>
          
          <form className={classes.root} noValidate autoComplete="off">
            <TextField id="outlined-basic" label="Username" variant="outlined" inputRef={usernameInput}/><br/>
            <TextField id="outlined-basic" label="Password" type="password" variant="outlined" inputRef={passwordInput}/><br/>
            <TextField id="outlined-basic" label="Confirm Password" type="password" variant="outlined" inputRef={passConfirmInput}/><br/>
            <Button variant="contained" color="primary" onClick={(e) => handleSubmit(e)}>
              Submit
            </Button>
          </form>

        </div>
        <div role='alert'>
          {error ? <p className='red'>{error}</p> : null}
        </div>
      </Paper>
    </div>
    </>
  )
}

SignupForm.defaultProps = {
  location: {},
  history: {
    push: () => {},
  },
}

const formPaper = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(45),
      height: theme.spacing(35),
    },
    justifyContent: 'center',
  },
}));

export default SignupForm;