import Terminal from 'react-console-emulator'
import Button from '@material-ui/core/Button';
import React, { Component } from 'react';

function ReactTerminal(props) {
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
  }

  return (
    <div>
      <Terminal
      commands={commands}
      welcomeMessage={'Welcome to the React terminal!'}
      promptLabel={'me@React:~$'}
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
  //     Primary
  //   </Button>
  //   : ''}
