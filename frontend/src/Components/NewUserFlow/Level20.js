import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';
import Button from '@material-ui/core/Button';
import ReactTerminal from '../ReactTerminal';

function Level20(props) {
  const [showButton, setShowButton] = React.useState(false)

  return (
    <Level number={20} subtitle={"What is the title???"}>
      <ReactTerminal setShowButton={setShowButton} />
        {showButton ?   
      <Button variant="contained" color="primary">
        Button
      </Button>
      : ''}
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    >      
    </ContinueButton>
  </Level>)
}

export default Level20;