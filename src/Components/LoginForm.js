import React, { useEffect, useState } from 'react';
import AuthApiService from '../Services/auth-api-service';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

const LoginForm = (props) => {
  const classes = useStyles();
  const papers = formPaper();

  let usernameInput = React.createRef()
  let passwordInput = React.createRef()

  const [error, setError] = useState(null);

  const handleSubmitJwtAuth = (e) => {
    e.preventDefault()

    // const { username, password } = e.target;
    // console.log(usernameInput);
    AuthApiService.postLogin({
      username: usernameInput.current.value,
      password: passwordInput.current.value,
    })
      .then(user => {
        // console.log("Existing user logging in");
        usernameInput.current.value = ''
        passwordInput.current.value = ''
        // props.onLoginSuccess()
        handleLoginSuccess()
      })
      .catch(res => {
        setError(res.error);
      })
    }

    const handleLoginSuccess = () => {
      const { history } = props
      history.push('/spells')
      // if(props.onLogin){
      //   props.onLogin(true);
      // }
    }

    return (
    <>
    <h1>Login</h1>
    <div className={papers.root}>
      <Paper>
        <div>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField id="outlined-basic" label="Username" variant="outlined" inputRef={usernameInput}/><br/>
          <TextField id="outlined-password-input" label="Password" type="password" variant="outlined" inputRef={passwordInput}/><br/>
          <Button variant="contained" color="primary" onClick={(e) => handleSubmitJwtAuth(e)}>
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
};

LoginForm.defaultProps = {
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

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default LoginForm;