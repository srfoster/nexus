import React, { useRef, useEffect, useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { useLocalStorage, spread } from "../../../Util";
import Button from '@material-ui/core/Button';
import { SBS, Level, withConfetti, ContinueButton } from '../Level';
import ExitGameButton from '../../WorldWidgets/ExitGameButton';
import Page1 from './Puzzle1WholeNewWorld'
import Page2 from './Puzzle2CodeMemorization';
import Page3 from './Puzzle3TBD';
import Page4 from './Puzzle4TBD';
import Page5 from './Puzzle5TBD';
import { Level3Puzzle1EducationalContent } from '../EducationalResources';
import CloseUIButton from '../../WorldWidgets/CloseUIButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { DocModal, DocModalWithButton } from '../../Widgets/Docs';
import { sendOnCodeSpellsSocket } from '../../WorldWidgets/Util';

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

function HamburgerMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }; 

  const enterWorld = () => {
    sendOnCodeSpellsSocket("(close-ui)")
  }
  
  const exitGame = () => {
    sendOnCodeSpellsSocket("(unreal-eval-js \"KismetSystemLibrary.QuitGame(GWorld.GetPlayerController(0))\")")
  }
  
  const openModal = () => {
    setOpen(true);
  }


  return (
    <>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={enterWorld}>Enter World</MenuItem>
        <MenuItem onClick={openModal}>Docs</MenuItem>
        <hr/>
        <MenuItem onClick={exitGame}>Exit Game</MenuItem>
      </Menu>
      <DocModal open={open} setOpen={setOpen}/>
    </>
  )
}

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
