import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';

function Level57(props) {
  return (<Level number={57} subtitle={"Hmmm, what to call it???"}>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Level>)
}

export default Level57;