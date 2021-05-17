import React, { useEffect, useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {PublicListItems, PrivateListItems} from './ListItems';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import CodeSpells from '../../Assets/CodeSpells.png';
import Link from '@material-ui/core/Link';
import SpellsApiService from '../../Services/spells-api-service';
// import useStyles from '../../styles.js';
import { makeStyles} from '@material-ui/core/styles';

function Dashboard(props) {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.dashPaper, classes.fixedHeight);

  useEffect(() => {
    // Only running this to check if logged in
    SpellsApiService.getUserById('me')
      .then((user) => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
  }, [])

  return (
    isLoggedIn === undefined ?
    '': 
    <div className={classes.dashRoot}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.dashMenuButton, open && classes.dashMenuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.dashTitle}>
            {/* Admin */}
          </Typography>
          <Link href='https://codespells.org/index.html' className={classes.link}>
            <img src={CodeSpells} alt="CodeSpells" width="100%"></img>
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {isLoggedIn ? <PublicListItems/> : <PrivateListItems/>}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.dashContainer}>
          <Grid container spacing={3}>
            {/* Spell List */}
            <Grid item xs={12}>
              <Paper className={classes.dashPaper}>
                {props.child}
              </Paper>
            </Grid>
          </Grid>
          {/* Inserts relevant fab icon by page */}
          {isLoggedIn ? props.fabIcon : ''}
        </Container>
      </main>
    </div>
  )
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  dashRoot: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  dashMenuButton: {
    marginRight: 36,
  },
  dashMenuButtonHidden: {
    display: 'none',
  },
  dashTitle: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,},
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  dashContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  dashPaper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  link: {
    width: '10%',
  }
}));

export default Dashboard;
