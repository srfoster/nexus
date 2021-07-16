import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';

function Level4(props) {
  return (<Level number={4} subtitle={"...TBD..."}>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
  </Level>)
}

export default Level4;