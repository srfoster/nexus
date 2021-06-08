import React, { useEffect, useState } from 'react';
import { Chapter, ContinueButton } from './Chapter';

function Chapter57(props) {
  return (<Chapter number={57} subtitle={"Hmmm, what to call it???"}>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Chapter>)
}

export default Chapter57;