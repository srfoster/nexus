import React, { useEffect, useState, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DarkModeContext } from '../Context';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import Switch from '@material-ui/core/Switch';
import { purple } from '@material-ui/core/colors';
import { makeStyles, withStyles} from '@material-ui/core/styles';

function DarkModeSwitch(props) {
  const [darkMode, setDarkMode] = useContext(DarkModeContext);

  const AntSwitch = withStyles((theme) => ({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: purple[300],
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }))(Switch);
   return(<Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>
            <WbSunnyIcon fontSize='small' /></Grid>
              <Grid item>
               <AntSwitch checked={darkMode}
                   onChange={() => {
                      setDarkMode(!darkMode);
                      window.localStorage.setItem("dark-mode", ""+ !darkMode)
                      //  props.onChange(!darkMode)
                       console.log("HERE")
                   }} />
                </Grid>
          <Grid item>
            <NightsStayIcon fontSize='small' /></Grid>
            </Grid>
      </Typography>)
}

export default DarkModeSwitch