import React, { useEffect, useState } from 'react';
import { useLocalStorage } from "../../../Util";
import { AccountCreationReminder, ContinueButton, Level, LoginButton, withConfetti } from "../Level";
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { Gong } from '../../Widgets/NexusVoice';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';

//Pages & Puzzles
import TitleCardPage from './TitleCardPage';
import UsernameFormPage from './UsernameFormPage';
import LightOrDarkPage from './LightOrDarkPage';
import ChooseYourTeacherPuzzle from './ChooseYourTeacherPuzzle';
import SockPuppetIntroPuzzle from './SockPuppetIntroPuzzle';
import WaitingOnSockPuppetPage from './WaitingOnSockPuppetPage';

/*
An educational text adventure that leads you on epic quest
to learn coding through a variety of media: text, video, and 2D/3D environments
*/

function Level1CompletePage(props) {

  useEffect(() => {
    if (props.badges) {
      props.setBadges(props.badges.concat([{ name: props.badgeName }]))
    }
  })

  return (
    <>
      <Fade in={true} timeout={1000}>
        <Typography>Congratulations!</Typography></Fade>
      <Fade in={true} timeout={10000}>
        <Typography>You've completed Level 1!</Typography>
      </Fade>
    </>
  );
}


function MeetYourTeacher (props) {
  let [username, setUsername] = useLocalStorage("user-name", undefined);
  let [usernameDecisionMade, setUsernameDecisionMade] = useState(undefined);
  let [teacherDecisionMade, setTeacherDecisionMade] = useState(undefined);
  let [teacherReflectionDone, setTeacherReflectionDone] = useState(undefined);

  let reallyContinue = () => {
    if (currentPart + 1 != parts.length) {
      setCanContinue(false);
      setCurrentPart(1 + currentPart)
    } else {
      props.gotoNextLevel()
    }
  }

  //let setTitle = props.setTitle
  const [currentPart, setCurrentPart] = useLocalStorage("lvl1:currentPart", 0)
  const [canContinue, setCanContinue] = useState(false)

  let parts =
    [<UsernameFormPage setCanContinue={withConfetti(setCanContinue)} setUsername={setUsername} username={username} />,
    <LightOrDarkPage setCanContinue={withConfetti(setCanContinue)} />,
    <ChooseYourTeacherPuzzle setCanContinue={withConfetti(setCanContinue)} />,
    <SockPuppetIntroPuzzle  setCanContinue={withConfetti(setCanContinue)} username={username} />,
    <WaitingOnSockPuppetPage setCanContinue={withConfetti(setCanContinue)} username={username} />,
    <Level1CompletePage {...props} />]

  return (
    <>
      {currentPart == 0 && !canContinue ? <Gong /> : "" /* First visit */}
      <CardContent>
        {parts[currentPart]}
      </CardContent>
      <CardActions>
        {currentPart ?
          <Button key="back-button" onClick={() => { setCurrentPart(currentPart - 1); setCanContinue(false) }}>Back</Button> :
          ""}
        {canContinue || currentPart == parts.length - 1 ?
          <ContinueButton key="continue-button" onClick={reallyContinue} />
          : ""}
      </CardActions>
      {currentPart > 0 ? <AccountCreationReminder /> : ""}
    </>
  );
}


function Level1(props) {
  const [titleScreenComplete, setTitleScreenComplete] = useLocalStorage("game-started", false);
  const [title, setTitle] = useState("Introduction");

  const TitleScreen = (props) => {

    return (
      <>
        <Fade in={true} timeout={1000}>
          <TitleCardPage setTitleScreenComplete={ setTitleScreenComplete }/>
        </Fade>
        <LoginButton />
      </>
    );
  }

  return (!titleScreenComplete ? <TitleScreen /> :
    <Level setBadges={props.setBadges} number={1} subtitle={title} >
      <MeetYourTeacher key="meet-your-teacher" setTitle={setTitle} {...props} />
    </Level>)
}

export default Level1;