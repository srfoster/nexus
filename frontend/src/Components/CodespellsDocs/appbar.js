import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

export default function SearchAppBar(){
  const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: '100%',
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
  }));

const classes = useStyles();
return(

  <AppBar position="fixed" style={{width:`calc(100% - 240px)`}}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Material-UI
          </Typography>
          <Link href='https://codespells.org/index.html' className={classes.link}>
            <img src="http://nexus.codespells.org/static/media/CodeSpells.963573e2.png" alt="CodeSpells" width="100%"></img>
            {/*src=codespells*/}         
          </Link>
        </Toolbar>
      </AppBar>
);
  
}
