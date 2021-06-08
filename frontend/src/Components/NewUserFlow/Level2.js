import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';


export function Level2(props) {
  return (
    <>
      <Level number={2} subtitle={"Beyond the Gate"}>
        <ContinueButton
          onComplete={() => {
            props.setBadges(props.badges.concat([{ name: props.badgeName }]));
          }
          }></ContinueButton>
      </Level>
    </>
  )
}

export default Level2;