import React, { useEffect, useState } from 'react';
import { useLocalStorage, spread } from "../../Util";
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { ContinueButton } from './Level';
import { Level } from './Level';

function LastLevelContent(props) {
  return (
    <>
      <p>Hello!</p>
    </>
  )
}

function LastLevel(props) {
  const [currentPart, setCurrentPart] = useLocalStorage("lvl11:currentPart", 0)
  const [canContinue, setCanContinue] = useState(false)

  //Arbitrarily decided this was Level 11
  return (
    <>
      <Level number={11} subtitle={"To Be Continued..."}>
        <CardContent>
          <LastLevelContent />
        </CardContent>
        <CardActions>
          <Button key="back-button"
            onClick={() => {
              if (currentPart == 0) {
                props.gotoPrevLevel()
              } else {
                setCurrentPart(currentPart - 1);
                setCanContinue(false);
              }
            }}>Back</Button>
          <ContinueButton onClick={() => setCurrentPart(currentPart + 1)} />
        </CardActions>
      </Level>
    </>
  )
}

export default LastLevel;