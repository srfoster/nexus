import React from 'react';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {rawData} from './rawData'

const drawerWidth = 240;//240

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function ResponsiveDrawer(props) {
  const classes = useStyles();

  const raw = rawData

  const drawer = (
    <div style={{marginTop:"20px"}}>
      <div className={classes.toolbar} />
	  
        {raw.map((x) => (
            <div><a href={"#"+x.name} style={{color:"#000000","text-decoration":"none"}}><Typography align="left" style={{marginLeft:'20px'}}>{x.name}</Typography></a><br/></div>
        ))}
    </div>
  );

  return (
    <div className={classes.root}>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
			anchor="right"
          >
            {drawer}
          </Drawer>
    </div>
  );
}

export default ResponsiveDrawer;
