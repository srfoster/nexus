import React, { useEffect, useState } from 'react';
import { useLocalStorage, spread } from "../../../Util";
import { AccountCreationReminder, ContinueButton, Level, LoginButton, withConfetti } from "../Level";
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';

//Pages & Puzzles
import Step1TitleCard from './Step1TitleCard';
import Step2UsernameForm from './Step2UsernameForm';
import Step3LightOrDark from './Step3LightOrDark';
import Step4ChooseYourTeacher from './Step4ChooseYourTeacher';
import Step5SockPuppetIntro from './Step5SockPuppetIntro';
import Step6WaitingOnSockPuppet from './Step6WaitingOnSockPuppet';

//Educational Resources
import { Level1Step2EducationalContent, Level1Step3EducationalContent, Level1Step4EducationalContent, Level1Step5EducationalContent, Level1Step6EducationalContent, Level1CompletePageEducationalContent } from '../EducationalResources';

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

  let educationalResources =
    [<Level1Step2EducationalContent />,
    <Level1Step3EducationalContent />,
    <Level1Step4EducationalContent />,
    <Level1Step5EducationalContent />,
    <Level1Step6EducationalContent />,
    <Level1CompletePageEducationalContent />]

  let parts =
    [<Step2UsernameForm setCanContinue={withConfetti(setCanContinue)} setUsername={setUsername} username={username} />,
    <Step3LightOrDark setCanContinue={withConfetti(setCanContinue)} />,
    <Step4ChooseYourTeacher setCanContinue={withConfetti(setCanContinue)} />,
    <Step5SockPuppetIntro setCanContinue={withConfetti(setCanContinue)} username={username} />,
    <Step6WaitingOnSockPuppet setCanContinue={withConfetti(setCanContinue)} username={username} />,
    React.createElement(Level1CompletePage, props)
    ]

  return (
    <>
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
          <Step1TitleCard setTitleScreenComplete={ setTitleScreenComplete }/>
        </Fade>
        <LoginButton />
      </>
    );
  }

  return (!titleScreenComplete ? <TitleScreen /> :
    <Level setBadges={props.setBadges} number={1} subtitle={title} >
      {React.createElement(MeetYourTeacher, spread({ key: "meet-your-teacher", setTitle: setTitle }, props))}
    </Level>)
}

export default Level1;