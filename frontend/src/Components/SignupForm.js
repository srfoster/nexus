import React, { useEffect, useState } from 'react';
import { Link, Route } from "react-router-dom";
import AuthApiService from '../Services/auth-api-service';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Helmet} from "react-helmet";
import Header from './Header';
import useStyles from '../styles.js';

const SignupForm = (props) => {
  const classes = useStyles();
  let usernameInput = React.createRef()
  let passwordInput = React.createRef()
  let passConfirmInput = React.createRef()
  
  var showSigninMessage = props.showSigninMessage === undefined ? true : props.showSigninMessage;
  const [error, setError] = useState(null);
  
  let showTopContent = true;
  if (props.showTopContent !== undefined) { showTopContent = props.showTopContent;}

  let signupButtonContent = props.signupButtonContent || "Sign Up"

  const handleSubmit = (e) => {
    e.preventDefault()

    if(passwordInput.current.value !== passConfirmInput.current.value){
      setError("Password do not match");
      return;
    }

    AuthApiService.postUser({
      username: usernameInput.current.value,
      password: passwordInput.current.value,
    })
      .then(user => {
        usernameInput.current.value = ''
        passwordInput.current.value = ''
        passConfirmInput.current.value = ''
        setTimeout(handleSignupSuccess, 1000) //Hacky. Why necessary to time out?
      })
      .catch(res => {
        setError(res.error);
      })
  }
  
    const handleSignupSuccess = () => {
      const { history } = props
      window.location = "/"; //History.push would be faster but doesn't trigger reload of app component
    }

    return (
    <>
      <Helmet>
        <title>Signup | CodeSpells Nexus</title>
        <meta name="description" content="Sign up for a CodeSpells Nexus account and start writing and saving your spells today." />
      </Helmet>
      {/* <Route
        path={'/'}
        component={Header}
      /> */}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
          <div className={classes.signupFormPaper}>
            {showTopContent ? <><Avatar className={classes.signupFormAvatar}>
              <LockOutlinedIcon />
            </Avatar>
              <Typography component="h1" variant="h5">
                Create an Account
          </Typography></> : ""}
          <form className={classes.signupFormForm} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  inputRef={usernameInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  inputRef={passwordInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confirm-password"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  autoComplete="current-password"
                  inputRef={passConfirmInput}
                />
              </Grid>
            </Grid>
            <div role='alert'>
              {error ? <p className='red'>{error}</p> : null}
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.signupFormSubmit}
              onClick={(e) => handleSubmit(e)}
            >
                { signupButtonContent}
            </Button>
            <Grid container justify="flex-end">
                {showSigninMessage ?
                  <Grid item>
                    <Link to={'/login'} variant="body2">
                      Already have an account? Sign in.
                    </Link>
                  </Grid> : ""}
            </Grid>
          </form>
        </div>
        {/* <Box mt={5}>
          <Copyright />
        </Box> */}
      </Container>
    </>
  )
}

SignupForm.defaultProps = {
  location: {},
  history: {
    push: () => {},
  },
}

export default SignupForm;