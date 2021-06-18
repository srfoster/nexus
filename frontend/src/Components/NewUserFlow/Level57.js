import React, { useEffect, useState, useContext } from 'react';
import { Level, ContinueButton } from './Level';
import Link from '@material-ui/core/Link';
import useStyles from '../../styles.js';
import DarkModeSwitch from '../Widgets/DarkModeSwitch';

function Level57(props) {
  const classes = useStyles();

  return(
    <Level number={57} subtitle={"Hmmm, what to call it???"}>
      <Link href='https://codespells.org/index.html' className={classes.link}></Link>
      <DarkModeSwitch />
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Level>)
}

export default Level57;