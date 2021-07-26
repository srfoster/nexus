import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

function Favor(props) {
  const [shown,setShown] = useState(false)
  return <>
    <Button variant="outlined" color="secondary"
      onClick={() => { props.onOpen && props.onOpen(); setShown(true) }}
    >
      A Favor (Click When in Need)
    </Button>
    {shown ? props.contents : ""}
  </>
}

function SockPuppetFavorInInventory(props) {
  return <div style={{ marginTop: 20 }}>
    You have 1 item(s)
                    <ul>
      <li>
        Item 1:
          <Favor onOpen={() => props.onOpen && props.onOpen()}
          contents={props.content ||
            <>
              <p>
                You found it!  I'll change this message if we ever get separated.  The favor will stay in your inventory.  Now go click the "Next" button.
              </p>
              <p>
                ~Your Friend, Socky
              </p>
            </>
          } />
      </li>
    </ul>
  </div>
}

export default SockPuppetFavorInInventory;