import React, { useRef, useEffect, useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { useLocalStorage, spread } from "../../../Util";
import Button from '@material-ui/core/Button';
import { SBS, Level, withConfetti, ContinueButton } from '../Level';
import Page1 from './Puzzle1WholeNewWorld'
import Page2 from './Puzzle2CodeMemorization';
import Page3 from './Puzzle3TBD';
import Page4 from './Puzzle4TBD';
import Page5 from './Puzzle5TBD';
import { Level3Puzzle1EducationalContent } from '../EducationalResources';
import { HamburgerMenu } from '../../WorldWidgets/Util';

// Stephen's widget wishlist:
// * Calendar?  Trello?  (Meta: time management of learning)
// * Flashcards?  (SRS)
// * Spreadsheet
// * Simulation / sugarscape / net logo
// * Coding: Blockly, Runes, Dataflow... 
// * Pixel editor
// * Chat
// * Impress js - Hard to confine to one div...
// * Tensor Flow - What is an interesting model to use?  How to get it to work with react-tensorflow?
// * Konva


export function Level3(props) {
  const [currentPart, setCurrentPart] = useLocalStorage("lvl3:currentPart", 0)
  const [canContinue, setCanContinue] = useState(false)
  
  let reallyContinue = () => {
    if (currentPart + 1 != parts.length) {
      window.gtag('event', "partFinished:lvl3:" + currentPart);
      setCanContinue(false);
      setCurrentPart(1 + currentPart)
    } else {
      props.gotoNextLevel()
    }
  }


  let educationalResources =
    [<Level3Puzzle1EducationalContent/>
    //... create educational resources as we add new puzzles
    ]

  let parts = [<Page1 setCanContinue={withConfetti(setCanContinue)} />,
               <Page2 setCanContinue={withConfetti(setCanContinue)} />,
               <Page3 setCanContinue={withConfetti(setCanContinue)} />,
               <Page4 setCanContinue={withConfetti(setCanContinue)} />,
               <Page5 setCanContinue={withConfetti(setCanContinue)} />
              ]

  return (
    <>
      <Level number={3} subtitle={"The Mission"} action={<HamburgerMenu/>}>
        <CardContent>
          {parts[currentPart]}
        </CardContent>
        <CardActions>
          {currentPart==0?"":<Button key="back-button"
            onClick={() => {
              if (currentPart == 0) {
                props.gotoPrevLevel()
              } else {
                setCurrentPart(currentPart - 1);
                setCanContinue(false);
              }
            }}>Back</Button>}
          {canContinue ?
            <ContinueButton key="continue-button" onClick={reallyContinue} />
            : ""}
        </CardActions>
      </Level>
    </>
  )
}

export default Level3;
