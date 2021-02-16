import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const Header = (props) => {
  const header = headerStyle();

  const handleLoginClick = () => {
    const { history } = props
    history.push('/login')
  }
  const handleSignupClick = () => {
    const { history } = props
    history.push('/signup')
  }

  return (
    <div className={header.root}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={() => handleSignupClick()}>Create Account</Button>
          <Button color="inherit" onClick={() => handleLoginClick()}>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  )

  // return props.isLoggedIn ? (
  //   <div className="header">
  //     <Link to='/hangar'>
  //       My Hangar
  //     </Link>
  //     {" | "}
  //     <Link to='/logout'>
  //       Logout
  //     </Link>
  //   </div>
  // ) : (
  //   <div className={header.root}>
  //     <Link to='/signup'>
  //       Create Account
  //     </Link>
  //     {" | "}
  //     <Link to='/login'>
  //       Login
  //     </Link>
  //   </div>
  // ) 
}

Header.defaultProps = {
  location: {},
  history: {
    push: () => {},
  },
}

const headerStyle = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  // alignSelf: 'right'
}));

export default Header;


  // <div className={classes.root}>
  //   <AppBar position="static">
  //     <Toolbar>
  //       <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
  //         <MenuIcon />
  //       </IconButton>
  //       <Typography variant="h6" className={classes.title}>
  //         News
  //       </Typography>
  //       <Button color="inherit">Login</Button>
  //     </Toolbar>
  //   </AppBar>
  // </div>