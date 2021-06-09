import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';

function Level8(props) {
  return (<Level number={8} subtitle={"...TBD..."}>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Level>)
}

export default Level8;