import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';
import './Styles/Tetris.css'
import {points , linesCleared} from 'react-tetris';
const Tetris = require('react-tetris');

function Level6(props) {
  const { winningPoints , setWinningPoints } = useState(0) 
  return (
    <React.Fragment>
      <Level number={6} subtitle={"Orb Tetris...!? Why Not?"}>
        <ul>
          <li>Wow the Nexus is impressed you made it this far.....</li>
          <li>But can you beat SockTeacher's Orb Tetris Highscore to continue....? I guess we'll see</li>
          <li>Although.... SockTeacher did not tell us his score, but don't worry it shouldn't be too high. I mean he's only lvl 1...</li>
        </ul>
        <div >
          <h1 className="title">Orb Tetris</h1>
            <Tetris >
              {({ points, linesCleared }) => {
                return (
                  <div className="points">
                    <p onChange={()=> setWinningPoints(points) }>Points: {points} </p>
                    <p>Lines Cleared: {linesCleared}</p>
                  </div>
                );
              }}
          </Tetris>
          <Tetris  >
            {({ HeldPiece, Gameboard, PieceQueue , }) => {
              return (
                <div className="tetris">
                  <div>
                    <HeldPiece />
                  </div>
                  <Gameboard />
                  <PieceQueue />
                </div>
              );
            }}
          </Tetris>
          <Tetris  >
            {({points}) => {
              return (
                <div>
                  { points > 50 ? 
                    <ContinueButton style={{ marginRight: "auto" }}
                      onComplete={() => {
                        props.setBadges(props.badges.concat([{ name: props.badgeName }]));
                      }}
                    ></ContinueButton> : console.log( "ternary" , points)
                  }
                </div>
              );
            }}
          </Tetris>
        </div> 
      </Level>
    </React.Fragment>
  )
};  
 


export default Level6;




