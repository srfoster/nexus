import React, { useEffect, useState } from 'react';
import { Chapter, ContinueButton } from './Chapter';


export function Chapter2(props) {
  return (
    <>
      <Chapter number={2} subtitle={"Beyond the Gate"}>
        <ContinueButton
          onComplete={() => {
            props.setBadges(props.badges.concat([{ name: props.badgeName }]));
          }
          }></ContinueButton>
      </Chapter>
    </>
  )
}

export default Chapter2;