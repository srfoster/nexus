import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';
import Button from '@material-ui/core/Button';
import ReactTerminal from '../ReactTerminal';

function Level20(props) {
  const [showButton, setShowButton] = React.useState(false);  

  return (
    <Level number={20} subtitle={"You've reached terminal buttonosity!"}>
      <ReactTerminal setShowButton={setShowButton} />
      <ContinueButton
        onComplete={() => {
          props.setBadges(props.badges.concat([{ name: props.badgeName }]));
        }}
      ></ContinueButton>
      {showButton ? (
        <Button variant="contained" color="primary">
          Button
        </Button>
      ) : (
        ""
      )}
    </Level>
  );
}

export default Level20;