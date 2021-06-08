import React, { useEffect, useState } from 'react';
import { Chapter, ContinueButton } from './Chapter';

function Chapter20(props) {
  return (<Chapter number={20} subtitle={"What is the title???"}>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Chapter>)
}

export default Chapter20;