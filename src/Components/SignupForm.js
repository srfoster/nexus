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
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Header from './Header';

const SignupForm = (props) => {
  const classes = useStyles();

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
      history.push('/login')
    }

    return (
    <>
      <Route
        path={'/'}
        component={Header}
      />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
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
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <div role='alert'>
              {error ? <p className='red'>{error}</p> : null}
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(e) => handleSubmit(e)}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to={'/login'} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default SignupForm;