import React, { useEffect, useState } from 'react';
import { useLocalStorage } from "../../../Util";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';
import ReactPlayer from 'react-player'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DarkModeSwitch from '../../Widgets/DarkModeSwitch';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MultipleChoiceQuestion, JSMirror } from '../../Widgets/Educational';
import { NewMessageNotification, SockPuppetChip, StudentChip, SpinThen, FakeTeacherChip, Gong } from '../../Widgets/NexusVoice';
import { Level, LoginButton, ContinueButton, withConfetti, SBS, AccountCreationReminder } from "../Level";
import ChatBubble from '../../Widgets/ChatBubble/';

/*
An educational text adventure that leads you on epic quest
to learn coding through a variety of media: text, video, and 2D/3D environments
*/

const TitleCardPage = ({ setTitleScreenComplete }) => {
  let [step, setStep] = useState(0);

  let os_name = "Not known";
  if (navigator.appVersion.indexOf("Win") != -1) 
    os_name = "Windows OS";
  if (navigator.appVersion.indexOf("Mac") != -1) 
    os_name = "MacOS";
  if (navigator.appVersion.indexOf("X11") != -1) 
    os_name = "UNIX OS";
  if (navigator.appVersion.indexOf("Linux") != -1) 
    os_name = "Linux OS";

  useEffect(() => {
    setTimeout(() => setStep(1), 2000)
    setTimeout(() => setStep(2), 4000)
  }, [])

  return( 
  <Card style={{ margin: 0, position: "absolute", top: "50%", left: "50%", msTransform: "translate(-50%,-50%)", transform: "translate(-50%,-50%)" }}>
    <CardContent>
      <Fade in={true} timeout={1000}>
        <div style={{ textAlign: "center", padding: "20px 40px 20px 40px" }}>
          <Typography variant="h1" style={{ fontSize: 25 }}>
            CodeSpells: The Nexus
                  </Typography>
          <br />
          <Typography variant="h2" style={{ fontSize: 16 }}>
            A Text Adventure about the Magic of Coding
                  </Typography>
        </div>
      </Fade>
    </CardContent>
      <CardActions>
        {os_name == "Windows OS" ?
          <Alert severity="error" style={{ visibility: "hidden" }}>Warning: This game is currently only compatible with <br/>Windows OS. On other operating systems, you won't be <br/>able to proceed beyond Level 2. Proceed with caution.</Alert>:
          <Alert severity="error">Warning: This game is currently only compatible with <br/>Windows OS. On other operating systems, you won't be <br/>able to proceed beyond Level 2. Proceed with caution.</Alert>
        }
        {step < 1 ? //This hidden button trick is a bit gross.  
          // Makes sure the button is there to force the container
          // to have a particular height.  Then we render a new (not hidden) button
          // so it Fades in nicely....  TODO: Do this more idiomatically.
          // Wish someone would come along and fix this.  -The Devs of the Nexus...
          <ContinueButton key="hidden-next-button" style={{ visibility: "hidden" }}
            onClick={() => setTitleScreenComplete(true)} /> :
          <ContinueButton key="unhidden-next-button"
            onClick={() => setTitleScreenComplete(true)} />
        }
      </CardActions>
  </Card>
  )}


function UserNameFormPage(props) {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useLocalStorage("user-name-available", undefined);
  const [username, setUsernameLocal] = useState(props.username);

  useEffect(() => {
    if (username && available) {
      props.setCanContinue(true)
    }
  }, [])

  function checkAvailability() {
    setChecking(true)

    //Would do network call here...
    setTimeout(() => {
      setChecking(false)
      setAvailable(true)

      //Causing annoying re-render...
      props.setUsername(username);
      props.setCanContinue(true)
    }, 1000)
  }

  function OneMoment(props) {
    return (
      <Typography>One moment...</Typography>
    )
  }

  function UsernameInput() {

    function handleKeyUp(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("availabilityButton").click();
      }
    }

    return (
      available ?
        <>
          <Typography>Welcome,</Typography>
          <Chip avatar={<AccountCircle />}
            label={username} />
        </>
        : (
          <>
            <TextField
              id="inputField"
              autoFocus
              onKeyUp={handleKeyUp}
              onChange={(e) =>
                setUsernameLocal(e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </>
        )
    )
  }

  return (<Grid container spacing={1}>
    <Fade in={true} timeout={1000}>
      <Grid item xs={6} >
        <Typography>At the Nexus, you are a user of magic. What shall we call you?</Typography>
      </Grid>
    </Fade>
    <Fade in={true} timeout={5000}>
      <Grid item xs={6}>
        {checking ? OneMoment() : UsernameInput()}

        {username === undefined || checking ? "" :
          <Fade key="check-available" in={true} timeout={1000}>
            <Button size="small" id="availabilityButton" onClick={() => {
              if (!available) {
                checkAvailability()
              } else {
                setAvailable(undefined)
                props.setCanContinue(false)
              }
            }
            }>{!available ? "Check Availability" : "Undo?"}</Button>
          </Fade>}
      </Grid>
    </Fade>
  </Grid>)
}


function LightOrDarkPage(props) {
  let [darkModeDecisionMade, setDarkModeDecisionMade] = useState(undefined);
  //Add sounds effects to Light vs Dark mode

  useEffect(() => {
    if (window.localStorage.getItem("dark-mode")) {
      props.setCanContinue(true)
    }
  }, [])

  return (<>
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Fade in={true} timeout={1000}>
          <Typography style={{ marginBottom: 10 }}>In the Nexus,
            <br />
            your preferences matter</Typography>
        </Fade>
      </Grid>
      <Grid item xs={6}>
        <Fade in={true} timeout={2000}>
          <div>
            <Typography>Light or Dark?</Typography>
            <DarkModeSwitch
              onChange={(darkMode) => {
                //Triggers a re-render, so we'll use local storage instead of state
                setDarkModeDecisionMade(true)
              }}
            /></div>
        </Fade>
      </Grid>
    </Grid>
  </>)
}


function ChooseYourTeacherPage(props) {
  const [teacherAvailable, setTeacherAvailable] = React.useState(false);

  return (
    <>
      <Grid container spacing={1}>
        <Fade in={true} timeout={1000}>
          <Grid item xs={6}>
            <Typography>In the Nexus,
                <br />
                we try to accomodate...
              </Typography>
          </Grid>
        </Fade>
        <Fade in={true} timeout={2000}>
          <Grid item xs={6}>
            <MultipleChoiceQuestion question="Who would you like to teach you magic?" answers={[
              { correct: true, text: <SockPuppetChip />, feedback: <SpinThen spinTime={500}>Available!</SpinThen> },
              { correct: false, text: <FakeTeacherChip name="Wizard of the Forest" />, feedback: <SpinThen spinTime={1000}>Sorry, I tried to contact the wizard, but his computer did not respond within 1000 milliseconds and his last GPS location appears to be in the middle of the Forest. The Nexus apologizes for putting him on this list.</SpinThen> },
              { correct: false, text: <FakeTeacherChip name="Super-intelligent AI" level={500} />, feedback: <SpinThen spinTime={3000}>Sorry. The Super-intelligent AI has considered your request for the required 3000 milliseconds, and sends the following message: "I'm currently maxed out at five million students, please try again when you've attained a higher level."</SpinThen>},
              { correct: false, text: <FakeTeacherChip name="The Nexus Devs" />, feedback: <SpinThen spinTime={5000}>This feature is still under development.</SpinThen> },
              { correct: false, text: "None of these", feedback: <FakeTeacherChip name="The Nexus Devs" />, feedback: <SpinThen spinTime={5000}>Sorry, your current level is too low for you to continue without a teacher, and I can't find any other available teachers for your level.</SpinThen> },
            ]}
              buttonText="Check Availability"
              onCorrect={() => props.setCanContinue(true)}
              onIncorrect={() => props.setCanContinue(false)}
            />
          </Grid>
        </Fade>
      </Grid>
    </>
  );
}


function SockPuppetVideoIntroPage(props) {
  let [videoFinished, setVideoFinished] = useState(false);
  let [playing, setPlaying] = useState(false);
  let [messageOpened, setMessageOpened] = useState(false);

  return (
    messageOpened ?
      <SBS
        leftSideTitle={<>
          <Typography component='span' paragraph>From <SockPuppetChip /> to <StudentChip name={props.username} level={1} /></Typography>
          <Typography>Subject: Video Introduction!!</Typography>
        </>}
        leftSide={
          <div style={{ backgroundColor: "black" }}>
            <ReactPlayer
              width={"100%"}
              url="https://codespells-org.s3.amazonaws.com/NexusVideos/e1-sock-4.mp4"
              controls={true}
              style={{}}
              playing={playing}
              onEnded={() => setVideoFinished(true)}
              progressInterval={100}
              onProgress={(p) => { }}
            />
          </div>
        }
        rightSide={
          videoFinished ?
            <>
              <SockPuppetVideoIntroText setCanContinue={props.setCanContinue} username={props.username} />

            </> : ""}
      />
      :
      <NewMessageNotification
        nexusSays={"Wow!  New messages(s)..."}
        from={<SockPuppetChip></SockPuppetChip>}
        onOpenClicked={
          () => setMessageOpened(true)
        }
      />
  );
}


function SockPuppetVideoIntroText(props) {
  return (
    <>
      <Typography paragraph>Hi {props.username}!</Typography>
      <Typography paragraph>The Nexus just assigned me to be your Magic Teacher. I'm going to start making personalized videos and puzzles to help you learn magic!</Typography>
      <Typography paragraph>In the meantime, I'm attaching a silly personality quiz below.</Typography>
      <Typography paragraph>I wrote the questions and all the funny responses personally.  Please read all of them because the whole thing is supposed to buy me time to make your personalized video content.</Typography>
      <Typography paragraph>Sincerely,</Typography>
      <Typography paragraph>Sock Puppet</Typography>
      <MultipleChoiceQuestion style={{ marginTop: 50 }}
        question="Do you think a sock can teach?"
        answers={[
          {
            correct: true, text: "Yes, if a sock can't teach something, it cannot be taught!",
            feedback: `Personality assessment result: User with name "${props.username}" is an optimist who likes socks.  User may continue.`
          },
          {
            correct: true, text: "Yes, socks can teach you what NOT to do.",
            feedback: `Personality assessment result: User with name "${props.username}" harbors mild anti-sock tendencies and should be monitored.  User may continue.`
          },
          {
            correct: true, text: "No, socks are inanimate objects",
            feedback: `Personality assessment result: User with name "${props.username}" considers themselves to be superior to socks.  Recommended for sock sympathy training.  User may continue.`
          },
          {
            correct: true, text: "No, I do not trust socks",
            feedback: `Personality assessment result: User with name "${props.username}" has had negative experiences with socks.  Recommended for sock exposure therapy.  User may continue.`
          },
          {
            correct: false, text: "These answers are too restrictive",
            feedback: `Personality assessment result: User with name "${props.username}" is a narcisist who thinks their personality is too complex to be assessed by multiple-choice questions. User may not continue.`
          },
        ]}
        buttonText="Submit Answer"
        onCorrect={() => props.setCanContinue(true)}
        onIncorrect={() => props.setCanContinue(false)}
      />
    </>
  )
}

function PleaseWaitWhileSockPuppetCreatesContentPage(props) {
  var [step, setStep] = useState(0)
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-password-lesson-opened", false)

  useEffect(() => {
    if (!messageOpened) {
      setTimeout(() => setStep(1), 1000)
      setTimeout(() => setStep(2), 3000)
      setTimeout(() => setStep(3), 6000)
      setTimeout(() => setStep(4), 9000)
      setTimeout(() => setStep(5), 12000)
      setTimeout(() => setStep(6), 15000)
      setTimeout(() => setStep(7), 18000)
      setTimeout(() => setStep(8), 21000)
      setTimeout(() => setStep(9), 24000)
      setTimeout(() => setStep(10), 27000)
      setTimeout(() => setStep(11), 30000)
      setTimeout(() => setStep(12), 33000)
      setTimeout(() => setStep(13), 36000)
      setTimeout(() => setStep(14), 39000)
    }
  }, [])

  return (!messageOpened ? <div>
    {step >= 1 ?
      <Typography paragraph><SockPuppetChip /><span>is making video content!</span></Typography>
      : ""}
    {step >= 2 ?
      <Fade in={true}>
        <ChatBubble message={"While you wait, please know:"}></ChatBubble></Fade> 
        : ""}
    {step >= 3 ?
      <Fade in={true} timeout={500}>
        <ChatBubble message={"The Nexus prides itself in its educational content for magic users."}></ChatBubble>
      </Fade>
      : ""}
    {step >= 4 ?
      <Fade in={true} timeout={500}>
        <ChatBubble message={"At the Nexus, your educational experience is our highest priority."}></ChatBubble>
      </Fade>
      : ""}
    {step >= 5 ?
      <Fade in={true} timeout={500}>
        <ChatBubble message={"At the Nexus, our teachers are carefully chosen for their teaching prowess"}></ChatBubble>
      </Fade>
      : ""}
    {step >= 6 ?
      <Fade in={true} timeout={500}>
        <ChatBubble message={"and their ability to produce educational content"}></ChatBubble>
      </Fade>
      : ""}
    {step >= 7 ?
      <Fade in={true} timeout={500}>
        <ChatBubble message={"under strict deadlines"}></ChatBubble>
      </Fade>
      : ""}
    {step >= 8 ?
      <ChatBubble message={"..."}></ChatBubble> 
      : ""}
    {step >= 9 ?
      <ChatBubble message={<><span>Sometimes our low-level teachers, like</span> <SockPuppetChip /></>}></ChatBubble> 
      : ""}
    {step >= 10 ?
      <ChatBubble message={"may not always meet the expected deadlines"}></ChatBubble> 
      : ""}
    {step >= 11 ?
      <ChatBubble message={"that we strive for"}></ChatBubble> 
      : ""}
    {step >= 12 ?
      <NewMessageNotification
        nexusSays={"Ah, here we go!"}
        from={<SockPuppetChip />}
        onOpenClicked={() => { setMessageOpened(true) }}/> 
      : ""}
    {step < 13 ? 
      <ChatBubble message={<CircularProgress style={{width:20, height:20}}></CircularProgress>}></ChatBubble> 
      : ""}
  </div> 
  : <SockPuppetFirstLessonPage setCanContinue={props.setCanContinue} username={props.username} />
  )
}


function Puzzle({ isComplete, code, hint }) {
  return <>
    <div>
      {code}
      {hint}
    </div>
  </>
}

const Magic = (props) => {
  let unlocked = props.children && JSON.stringify(props.children).includes("Hello, World!")

  return <>
    <Typography>This {unlocked ? "works!" : "doesn't work..."}</Typography>
    <Button
      onClick={() => {
        unlocked = props.children && JSON.stringify(props.children).includes("Hello, World!")
        if (unlocked) {
          props.setComplete(true)
          props.onComplete()
        }
      }}
      color="secondary">{props.children}</Button>
    <Typography paragraph>{props.complete ? ["Look below for the 'Next' button!"] : ""}</Typography>
  </>
}


function HelloWorldPuzzle(props) {
  const [complete, setComplete] = useState(false);
  const [code, setCode] = useState("<MagicButton>\n  Next\n</MagicButton>");

  return (
    <Fade in={true} timeout={1000}>
      <Puzzle code={
        <JSMirror code={code}
          scope={{ MagicButton: (userProps) => Magic({ ...userProps, ...props, setComplete, complete }) }}
          onChange={(code) => {
            //Note: Could statically read code here...
            setCode(code);
            return true
          }} />
      }
        hint={<><Typography paragraph>Hint: The magic button will only work if it contains the same text as the subject of my email.</Typography></>}
        isComplete={complete} />
    </Fade>
  )
}


function SockPuppetFirstLessonPage(props) {
  let [videoFinished, setVideoFinished] = useState(false);

  /*
  *out of breath* I'm sorry! I was rushing to put together this lesson for you.
 I didn't have time to memorize the Nexus' introductory script, so I'm
 just going to read it to you:
 *someone holds up index card at edge of frame*

 Welcome to the journey of a lifetime! I'm here to train you write your own
 magic spells with code!
 But first we have to see if you have what it takes to learn magic!
 Below this video message is a coding puzzle.  You'll have to read everything
 on this page carefully to pass this test.  Then you can officially enter the Nexus
 and continue your quest to learn magic!

 Okay, I'm going to go off-script here.  The Nexus's analytics show that
 this is the step where most users drop off.  When they have to write their
 first piece of code.
 I know you don't even know me.  And I know I'm just a sock puppet.  
 But could you please write this program?
 It would mean a lot to me.  I would owe you a favor.
 
  */

  return (
    <SBS
      leftSideTitle={
        <>
          <Typography component='span' paragraph>From <SockPuppetChip /> to <StudentChip name={props.username} level={1} /></Typography>
          <Typography >Subject: Hello, World!</Typography>
        </>}
      leftSide={
        <>
          <div style={{ backgroundColor: "black" }}>
            <ReactPlayer
              playsInline
              width={"100%"}
              url="https://codespells-org.s3.amazonaws.com/NexusVideos/e2-sock-4.mp4"
              controls={true}
              style={{}}
              playing={false}
              onEnded={() => {
                setVideoFinished(true)
              }}
            />
          </div>
        </>
      }
      rightSide={videoFinished ?
        <>
          <Typography paragraph>The puzzle is to modify the code below to generate a button that lets you proceed to the next part of the Nexus.</Typography>
          <HelloWorldPuzzle onComplete={() => props.setCanContinue(true)} />
        </>
        : ""}
    />

  )
}


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
    [<UserNameFormPage setCanContinue={withConfetti(setCanContinue)} setUsername={setUsername} username={username} />,
    <LightOrDarkPage setCanContinue={withConfetti(setCanContinue)} />,
    <ChooseYourTeacherPage setCanContinue={withConfetti(setCanContinue)} />,
    <SockPuppetVideoIntroPage  setCanContinue={withConfetti(setCanContinue)} username={username} />,
    <PleaseWaitWhileSockPuppetCreatesContentPage setCanContinue={withConfetti(setCanContinue)} username={username} />,
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