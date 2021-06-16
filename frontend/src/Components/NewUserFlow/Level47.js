import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';
import Snake from '../Widgets/SnakeGame/SnakeGame'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

//when terminal is integrated
// also pass it down through level 20 props 
  // setSnakeColor: {
  //   description: 'Changes the color of the snake',
  //   usage: 'setSnakeColor <color>',
  //   fn: function () {
  //     return (
  //       props.setSnakeColor(Array.from(arguments))
  //     )
  //   }
  // },
  // setAppleColor: {
  //   description: 'Changes the color of the apple',
  //   usage: 'setAppleColor <color>',
  //   fn: function () {
  //     return (
  //       props.setAppleColor(Array.from(arguments))
  //     )
  //   }
  // },


function Level47(props) {
  var keys = {};
  const [snakeColor, setSnakeColor] = useState('')
  const [appleColor, setAppleColor] = useState('')

  window.addEventListener("keydown",
      function(e){
          keys[e.keyCode] = true;
          switch(e.keyCode){
              case 37: case 39: case 38:  case 40: // Arrow keys
              case 32: e.preventDefault(); break; // Space
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
    <Level number={47} subtitle={"Snake? color?"}>
      <Grid container>
        <Grid item xs={6}>
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
            label="Type a color for apple" 
            variant="outlined" 
            value={appleColor}
            onChange={e => setAppleColor(e.target.value)} 
          />
        </Grid>
        <Grid item xs={6}>
          <Snake 
            key='snakeGame'
            percentageWidth={100}
            snakeColor={snakeColor}
            appleColor={appleColor}
          />
        </Grid>
        {snakeColor && appleColor && 
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