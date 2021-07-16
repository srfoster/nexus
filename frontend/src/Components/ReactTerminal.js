import React, { Component } from 'react';
import Terminal from 'react-console-emulator'
import Button from '@material-ui/core/Button';

  // Add the following items to Relevant page(s)

  // const [showButton, setShowButton] = React.useState(false)

  // <ReactTerminal/>
  // {showButton ?   
  //   <Button variant="contained" color="primary">
  //   Primary
  //   </Button>
  // : ''}


function ReactTerminal(props) {

  // Follow this format to create new commands for the ReactTerminal //
  const commands = {
    echo: {
      description: 'Echo a typed string.',
      usage: 'echo <string>',
      fn: function () {
        return `${Array.from(arguments).join(' ')}`
      }
    },
    renderButton: {
      description: 'Displays a button',
      usage: 'renderButton',
      fn: function () {
        return (
          props.setShowButton(true)
        )
      }
    },
    renderStars: {
      description: 'Displays stars',
      usage: 'renderStars',
      fn: function () {
        return (
          props.setShowStars(true)
        )
      }
    },
    setNumPoints: {
      description: 'Changes how many points the star has',
      usage: 'setNumPoints <number>',
      fn: function () {
        return (
          props.setNumPoints(Array.from(arguments)[0])
        )
      }
    },
    setStarColor: {
      description: 'Changes the color of the star',
      usage: 'setStarColor <color>',
      fn: function () {
        return (
          props.setStarColor(Array.from(arguments))
        )
      }
    },
  }

  return (

    <div>
      <Terminal
      commands={commands}
      welcomeMessage={'Welcome to the React terminal!'}
      promptLabel={'mage@Nexus:~$'}
      autoFocus="true"
      />  
    </div>
  );
}

export default ReactTerminal;


  // Add the following items to Relevant page(s)

  // const [showButton, setShowButton] = React.useState(false)

  // <ReactTerminal/>
  // {showButton ?   
  //   <Button variant="contained" color="primary">
  //   Primary
  //   </Button>
  // : ''}
