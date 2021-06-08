import React, { useEffect, useState } from 'react';
import { Chapter, ContinueButton } from './Chapter';

function Chapter3(props) {
  return (<Chapter number={3} subtitle={"Light Mage or Dark Mage?"}>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Chapter>)
}

export default Chapter3;