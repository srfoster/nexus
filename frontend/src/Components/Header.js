import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useStyles from '../styles.js';

const Header = (props) => {
  const classes = useStyles();

  const handleLoginClick = () => {
    const { history } = props
    history.push('/login')
  }
  const handleSignupClick = () => {
    const { history } = props
    history.push('/signup')
  }

  return (
    <div className={classes.headerRoot}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.headerTitle}>
          </Typography>
          <Button color="inherit" onClick={() => handleSignupClick()}>Create Account</Button>
          <Button color="inherit" onClick={() => handleLoginClick()}>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

Header.defaultProps = {
  location: {},
  history: {
    push: () => {},
  },
}

export default Header;