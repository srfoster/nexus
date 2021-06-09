import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';

function Level3(props) {
  return (<Level number={3} subtitle={"Light Mage or Dark Mage?"}>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Level>)
}

export default Level3;