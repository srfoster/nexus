import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';

function Level20(props) {
  return (<Level number={20} subtitle={"What is the title???"}>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Level>)
}

export default Level20;