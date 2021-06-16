import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';

function Level3(props) {
  return (<Level number={3} subtitle={"Light Mage or Dark Mage?"}>
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
      <ul>
        <li>META: why should you care as a human in a non-magical world</li>
        <li>We know we're just content on the internet and we're competing with a bunch of amazing other content you could be watching right now.</li>
        <li>Talk about the future here on Earth, talk about how it's relevant to the future of society here</li>
        <li>Some of us will become Mind Painters, some of us won't: how will that affect society</li>
        <li>Computation is really important!</li>
        <li>Topics to cover: fairness/equity, climate change, cyber-hacking/warfare, crypto, big tech, social media, games/addiction</li>
        <li>Puzzle: ???</li>
      </ul>
  </Level>)
}

export default Level3;