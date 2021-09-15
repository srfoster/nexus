import React, { useState } from 'react';
import { useLocalStorage } from "../../../Util";
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { AccountCreationReminder, ContinueButton, Level, withConfetti } from '../Level';

//Puzzles
import Puzzle1TheFavor from './Puzzle1TheFavor';
import Puzzle2ConwaysGameOfLife from './Puzzle2ConwaysGameOfLife';
import Puzzle3GraphTheory from './Puzzle3GraphTheory';
import Puzzle4Piano from './Puzzle4Piano';
import Puzzle5Diabolical from './Puzzle5Diabolical';
import DiabolicalPuzzleSolvedPage from './ForDiabolicalPuzzleSolvers';

//Educational Resources
import { Level2Puzzle1EducationalContent, Level2Puzzle2EducationalContent, Level2Puzzle3EducationalContent, Level2Puzzle4EducationalContent, Level2Puzzle5EducationalContent } from '../EducationalResources';

//Questions we're asking (and answering) with our..
//What if there were no difference between edtech, entertainment, content, game, community, open source project, etc.?
//   What if ed tech were different?

export function Level2(props) {
  const [currentPart, setCurrentPart] = useLocalStorage("lvl2:currentPart", 0)
  const [canContinue, setCanContinue] = useState(false)

  let reallyContinue = () => {
    if (currentPart + 1 != parts.length) {
      window.gtag('event', "partFinished:lvl2:" + currentPart);
      setCanContinue(false);
      setCurrentPart(1 + currentPart)
    } else {
      props.skiptoLastLevel()
    }
  }

  let educationalResources =
    [<Level2Puzzle1EducationalContent />,
    <Level2Puzzle2EducationalContent />,
    <Level2Puzzle3EducationalContent />,
    <Level2Puzzle4EducationalContent />,
    <Level2Puzzle5EducationalContent />]

  let parts =
    [<Puzzle1TheFavor setCanContinue={withConfetti(setCanContinue)} />,
      <Puzzle2ConwaysGameOfLife setCanContinue={withConfetti(setCanContinue)} />,
      <Puzzle3GraphTheory setCanContinue={withConfetti(setCanContinue)} />,
      <Puzzle4Piano setCanContinue={withConfetti(setCanContinue)} />,
      <Puzzle5Diabolical setCanContinue={withConfetti(setCanContinue)} />,
      <DiabolicalPuzzleSolvedPage setCanContinue={setCanContinue} />]

  return (
    <>
      <Level number={2} subtitle={"The Nexus Is What It Seems"} educationalContent={educationalResources[currentPart]}>
        <CardContent>
          {parts[currentPart]}
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
          {canContinue || currentPart == parts.length - 1 ?
            <ContinueButton key="continue-button" onClick={reallyContinue} />
            : ""}
        </CardActions>
        <AccountCreationReminder />
      </Level>
    </>
  )
}
/* Lindsey: Spaced repetition */
/*
Laurond: I have a character for you.. an individual who starts out in the lower caste and isn't considered creative or precise during childhood because their paintings and images make no sense to others, but then the *disruptive plot device event* causes them and a few others to be in a survival situation apart from the rest of the community, and nobody knows what to do, but the character has some ideas, and start learning how to communicate them instead of making the abstract art they used to make.
*/

export default Level2;