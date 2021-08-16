import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from '../Level';

function Level10(props) {
  return (<Level number={10} subtitle={"...TBD..."}>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Level>)
}

export default Level10;