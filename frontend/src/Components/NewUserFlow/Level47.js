import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';
import Snake from '../Widgets/SnakeGame/SnakeGame'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import ReactTerminal from '../ReactTerminal';

function Level47(props) {
  var keys = {};
  const [snakeColor, setSnakeColor] = useState('')
  const [orbColor, setOrbColor] = useState('')
  const [showTextBoxes, setShowTextBoxes] = useState(false)

  window.addEventListener("keydown",
      function(e){
          keys[e.keyCode] = true;
          switch(e.keyCode){
              case 37: case 39: case 38:  case 40: // Arrow keys
              e.preventDefault(); break; // Space
              default: break; // do not block other keys
          }
      },
  false);

  window.addEventListener('keyup',
      function(e){
          keys[e.keyCode] = false;
      },
  false);

  return (
    <Level number={47} subtitle={"Mr. Sock Puppet needs help collecting orbs for next component!!"}>
      <ReactTerminal 
        setOrbColor={setOrbColor} 
        setSnakeColor={setSnakeColor} 
        setShowTextBoxes={setShowTextBoxes} 
      />
      <Grid container>
        <Grid item xs={5}>
          {showTextBoxes ?
          <>
            <TextField
              id="outlined-basic" 
              label="Type a color for snake" 
              variant="outlined" 
              helperText="Hex codes work too! (#29f0cb)"
              value={snakeColor}
              onChange={e => setSnakeColor(e.target.value)} 
            />
            <TextField
              id="outlined-basic" 
              label="Type a color for Orb" 
              variant="outlined" 
              value={orbColor}
              onChange={e => setOrbColor(e.target.value)} 
            />
          </>
          :
            <div>
              <h4>Give it a try:</h4>
              <p>$ setSnakeColor &lt;color&gt;</p>
              <p>$ setOrbColor &lt;color&gt;</p>
              <p>$ renderTextBoxes</p>
            </div>
          }
        </Grid>
        <Grid item xs={7}>
          <Snake 
            key='snakeGame'
            percentageWidth={100}
            snakeColor={snakeColor}
            appleColor={orbColor}
          />
        </Grid>
        {snakeColor && orbColor && 
          <ContinueButton
            onComplete={() => {
              props.setBadges(props.badges.concat([{ name: props.badgeName }]));
            }}
          ></ContinueButton> 
        }
      </Grid>
    </Level>
  )
}

export default Level47;