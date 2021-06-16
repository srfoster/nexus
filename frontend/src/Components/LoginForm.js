import React, { useState } from 'react';
import { Link, Route } from "react-router-dom";
import AuthApiService from '../Services/auth-api-service';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Header from './Header';
import useStyles from '../styles.js';
import {Helmet} from "react-helmet";

const LoginForm = (props) => {
  const classes = useStyles();
  let usernameInput = React.createRef()
  let passwordInput = React.createRef()
  const [error, setError] = useState(null);

  const handleSubmitJwtAuth = (e) => {
    e.preventDefault()

    AuthApiService.postLogin({
      username: usernameInput.current.value,
      password: passwordInput.current.value,
    })
      .then(user => {
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
      history.push('/')
    }

    return (
    <>
      <Helmet>
        <title>Login | CodeSpells Nexus</title>
        <meta name="description" content="Log into the CodeSpells Nexus to create & save spells that you can cast in CodeSpells games and connect with other CodeSpells witches & wizards." />
      </Helmet>
      {/* <Route
        path={'/'}
        component={Header}
      /> */}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.loginFormPaper}>
          <Avatar className={classes.loginFormAvatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <form className={classes.loginFormForm} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              inputRef={usernameInput}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={passwordInput}
            />
            <div role='alert'>
              {error ? <p className='red'>{error}</p> : null}
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.loginFormSubmit}
              onClick={(e) => handleSubmitJwtAuth(e)}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <Link to={'/signup'} variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  )
};

LoginForm.defaultProps = {
  location: {},
  history: {
    push: () => {},
  },
}

export default LoginForm;