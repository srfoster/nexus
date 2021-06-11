import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';
import ReactTetris from '../Widgets/Tetris';
import '../Widgets/Tetris.css'

function Level6(props) {
  return (
    <React.Fragment>
      <Level number={6} subtitle={"Tetris...? Why Not?"}>
     <ReactTetris />
    <ContinueButton
      onComplete={() => {
        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
      }}
    ></ContinueButton>
  </Level>
  </React.Fragment>
  )
}     
 


export default Level6;




