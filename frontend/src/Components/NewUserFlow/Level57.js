import React, { useEffect, useState, useContext } from 'react';
import { Level, ContinueButton } from './Level';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import { purple } from '@material-ui/core/colors';
import { makeStyles, withStyles} from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import useStyles from '../../styles.js';
import Typography from '@material-ui/core/Typography';
import { DarkModeContext } from '../Context';

function Level57(props) {
  const [darkMode, setDarkMode] = useContext(DarkModeContext);
  const classes = useStyles();
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

  return(
    <Level number={57} subtitle={"Hmmm, what to call it???"}>
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item><WbSunnyIcon fontSize='small'/></Grid>
              <Grid item>
                 <AntSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                </Grid>
              <Grid item><NightsStayIcon fontSize='small'/></Grid>
            </Grid>
      </Typography>
          <Link href='https://codespells.org/index.html' className={classes.link}></Link>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Level>)
}

export default Level57;