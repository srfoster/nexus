// import './Tetris.css'
const React = require('react');
const Tetris = require('react-tetris');
 
const ReactTetris = () => (
  <div >
    <h1 className="title">Tetris</h1>
    <Tetris >
      {({ points, linesCleared }) => {
        // Render it however you'd like
        return (
          <div className="points">
              <p>Points: {points}</p>
              <p>Lines Cleared: {linesCleared}</p>
          </div>
        );
      }}
    </Tetris>
    <Tetris  >
      {({ HeldPiece, Gameboard, PieceQueue}) => {
        // Render it however you'd like
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
  </div>
);

export default ReactTetris;

