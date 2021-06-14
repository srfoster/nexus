import React, { useEffect, useState } from 'react';
import { useLocalStorage } from "../../Util";
import { Level } from "./Level";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Fade from '@material-ui/core/Fade';
import ReactPlayer from 'react-player'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import DarkModeSwitch from '../Widgets/DarkModeSwitch';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import Sound from 'react-sound';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typing from 'react-typing-animation';



function Gong(){
  return <Sound
    url="/gong.mp3"
    playStatus={Sound.status.PLAYING}
    playFromPosition={0 /* in milliseconds */}
  />
}

function MultipleChoiceQuestion(props) {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState(' ');

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = () => {
    let selection = props.answers[Number(value)]
    if (selection) {
      setHelperText(selection.feedback);
      setError(!selection.correct);
      if (selection.correct) {
        props.onCorrect();
      } else {
        props.onIncorrect();
      }
    }
  }

  return (
    <>
      <Fade in={true} timeout={1000}>
        <>
          <FormControl component="fieldset" error={error}
            style={{ display: "flex", ...props.style }}>
            <FormLabel component="legend">{props.question}</FormLabel>
            <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
              {props.answers.map((e, i) => { return <FormControlLabel value={"" + i} control={<Radio />} label={e.text} /> })}
            </RadioGroup>
            <FormHelperText>{helperText}</FormHelperText>
          </FormControl>
          <Button size="small" onClick={handleSubmit} type="submit" variant="solid" color="primary">{props.buttonText}</Button>
        </>
      </Fade>
    </>
  );
}


function NewMessageNotification(props) {
  return(<Grid container spacing={1}>
    <Fade in={true} timeout={1000}>
      <Grid item xs={6}>
        <Typography>
          {props.nexusSays}
        </Typography>
      </Grid>
    </Fade>
    <Fade in={true} timeout={2000}>
      <Grid item xs={6}>
        <Gong />
        <Badge badgeContent={1} color="secondary">
          <MailIcon />
        </Badge>
        <Typography>from</Typography>
        {props.from}
        <Button size="small" onClick={ ()=>props.onOpenClicked() }>Open?</Button>
      </Grid>
    </Fade>
  </Grid>)
}

function SockPuppetChip() {
  return <Chip avatar={<Avatar alt="Sock Puppet" src="/static/images/avatar/1.jpg" />} label="Sock Puppet (Lvl 1)"></Chip>
}

function FakeChip(props) {
  return <Chip avatar={<Avatar alt={props.name} src="/static/images/avatar/1.jpg" />} label={<span>{props.name} {" (Lvl " + (props.level !== undefined ? props.level : 10 * props.name.length) + ")"}</span>}></Chip>
}

const ContinueButton = (props) => {
  return (
    <Fade in={true} timeout={1000}>
      <Button color="secondary" style={{ marginLeft: "auto" }} onClick={props.onClick}>Next</Button>
    </Fade>
  );
}


const UserNameForm = (props) => {
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
              autoFocus
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
        <Typography>At the Nexus, what shall we call you?</Typography>
      </Grid>
    </Fade>
    <Fade in={true} timeout={5000}>
      <Grid item xs={6}>
        {checking ? OneMoment() : UsernameInput()

        }

        {username === undefined || checking ? "" :
          <Fade key="check-available" in={true} timeout={1000}>
            <Button size="small" onClick={() => {
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




  function ChooseYourTeacher(props) {
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
              <MultipleChoiceQuestion question="Select your teacher preference" answers={[
                { correct: true, text: <SockPuppetChip />, feedback: "Available!" },
                { correct: false, text: <FakeChip name="Wizard of the Forest" />, feedback: "Sorry, your current level is too low for you to prefer this teacher." },
                { correct: false, text: <FakeChip name="Super-intelligent AI" level={ 500 } />, feedback: "Sorry, your current level would make the super intelligent AI laugh." },
                { correct: false, text: <FakeChip name={<span>The Nexus Devs</span>} />,feedback: "Sorry, your current level is too low for us to bother the Devs at this time." },
                { correct: false, text: "None of these", feedback: "Sorry, your current level is too low for you to continue without a teacher." },
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



  // Decision: Do we need this question? What purpose does it serve?
  // Pro: breaks up video content, nice gamification rhythm
  function WhyIsMyTeacherASock(props) {
    return (
      <>
        <Typography paragraph>Hi { props.username }!</Typography>
        <Typography paragraph>I'm one of the Nexus's staff members.  I've written this personalized message to accompany the personalized introduction video above.</Typography>
        <Typography paragraph>At the Nexus, we pride ourselves on how personal everything is.  If I sound funny, please know that the Nexus's algorithms will count how many times I say "personal," so when I write these personalized introductions, I try to make them very personal.</Typography>
        <Typography paragraph>The Nexus is always listening.</Typography>
        <Typography paragraph>Anyway, because I'm a Level 1 teacher, I'm allowed to attach a silly personality quiz at the end of this personalized message.</Typography>
        <Typography paragraph>I wrote the questions and all the funny responses personally.  Please read all of them because the whole thing is supposed to buy me time to make your next video.</Typography>
        <Typography paragraph>Sincerely,</Typography>
        <Typography paragraph>Sock Puppet</Typography>
        <MultipleChoiceQuestion style={{marginTop: 50}}
          question="Your personal feelings matter.  Do you think a sock can teach?"
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
              feedback: `Personality assessment result: User with name "${props.username}" is a narcisist who thinks their snowflake-like personality is too complex to be assessed by multiple-choice questions. User may not continue.`
            },
          ]}
          buttonText="Submit Answer"
          onCorrect={() => props.setCanContinue(true)}
          onIncorrect={() => props.setCanContinue(false)}
        />
      </>
    )
  }

  //Choose your username
  function SockPuppetTeacherIntroduction(props) {
    let [videoFinished, setVideoFinished] = useState(false);
    let [playing, setPlaying] = useState(false);
    let [messageOpened, setMessageOpened] = useState(false);

    return (
      messageOpened ?
        <SBS
          leftSideTitle={<>
          <Typography paragraph>From <SockPuppetChip /> to <FakeChip name={props.username} level={1} /></Typography>
          <Typography>Subject: Video Introduction!!</Typography>
          </>}
          leftSide={
            <div style={{backgroundColor: "black"}}>
              <ReactPlayer
                fluid={false}
                width={"100%"}
                url="https://codespells-org.s3.amazonaws.com/NexusVideos/e1-sock-3.mp4"
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
                <WhyIsMyTeacherASock setCanContinue={props.setCanContinue} username={props.username} />

              </> : ""}
        />
        : <NewMessageNotification 
          nexusSays={"Wow!  New messages(s)..."}
          from={<SockPuppetChip></SockPuppetChip>}
          onOpenClicked={
            () => setMessageOpened(true)
          }
        />
    );
  }

  function PleaseWaitWhileSockPuppetCreatesContent(props) {
    var [step, setStep] = useState(0) 
    var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-password-lesson-opened",false) 
    
    useEffect(() => {
      setTimeout(()=>setStep(1), 1000)
      setTimeout(()=>setStep(2), 3000)
      setTimeout(()=>setStep(3), 6000)
      setTimeout(()=>setStep(4), 9000)
      setTimeout(()=>setStep(5), 12000)
      setTimeout(()=>setStep(6), 15000)
      setTimeout(()=>setStep(7), 18000)
      setTimeout(()=>setStep(8), 21000)
      setTimeout(()=>setStep(9), 24000)
      setTimeout(()=>setStep(10), 27000)
      setTimeout(()=>setStep(11), 30000)
      setTimeout(()=>setStep(12), 33000)
      setTimeout(()=>setStep(13), 36000)
      setTimeout(()=>setStep(14), 39000)
    },[])

    return (!messageOpened ? <div>
      {step >= 1 ?
          <Typography paragraph>
            <SockPuppetChip /> is making video content!
          </Typography>
        : ""}
      {step >= 2 ? 
      <Fade in={true}>
        <Typography paragraph>While you wait, please know:
        </Typography></Fade> : ""}
      
      {step >= 3 ? 
        <Fade in={true} timeout={500}>
          <Typography paragraph style={{ marginBottom: 30 }}>
            The Nexus prides itself in its content.
          </Typography>
        </Fade>
      : ""}
      {step >= 4 ? 
        <Fade in={true} timeout={500}>
          <Typography paragraph style={{ marginBottom: 30 }}>
            At the Nexus, your experience is our highest priority.   :SmileEmoji:
          </Typography>
        </Fade>
      : ""}
      {step >= 5 ? 
        <Fade in={true} timeout={500}>
          <Typography paragraph style={{ marginBottom: 30 }}>
            At the Nexus, our teachers are carefully chosen for their teaching prowess
          </Typography>
        </Fade>
      : ""}
      {step >= 6 ? 
        <Fade in={true} timeout={500}>
          <Typography paragraph style={{ marginBottom: 30 }}>
            and their ability to produce educational content
          </Typography>
        </Fade>
      : ""}
      {step >= 7 ? 
        <Fade in={true} timeout={500}>
          <Typography paragraph style={{ marginBottom: 30 }}>
            under strict deadlines
          </Typography>
        </Fade>
      : ""}
      {step >= 8 ? 
        <Fade in={true} timeout={500}>
          <Typography paragraph style={{ marginBottom: 30 }}>
            that the Nexus strives for in our continuing mission
          </Typography>
        </Fade>
      : ""}
      {step >= 9 ? 
        <Fade in={true} timeout={500}>
          <Typography paragraph style={{ marginBottom: 30 }}>
            to meet your educational needs
          </Typography>
        </Fade>
      : ""}
      {step >= 10 ? 
        <Typography paragraph style={{marginBottom: 30}}>
            ...
        </Typography> : ""
      }
      {step >= 11 ? 
        <Typography paragraph style={{marginBottom: 30}}>
            Sometimes our low-level teachers, like <SockPuppetChip />
        </Typography> : ""
      }
      {step >= 12 ? 
        <Typography paragraph style={{marginBottom: 30}}>
            may not always meet the expected deadlines
        </Typography> : ""
      }
      {step >= 13 ? 
        <Typography paragraph style={{marginBottom: 30}}>
          that we strive for
        </Typography> : ""
      }
      {step >= 14 ?
        <NewMessageNotification
          nexusSays={"Ah, here we go!"} 
          from={<SockPuppetChip />}
          onOpenClicked={()=>{setMessageOpened(true)}}
          />  : ""
      }

      {step < 14 ? <CircularProgress style={{marginTop: 20}} /> : ""}

    </div> : <SockPuppetPasswordLesson setCanContinue={props.setCanContinue} username={ props.username }/>
    )
  }
  
function SockPuppetPasswordLesson(props) {
    let [videoFinished, setVideoFinished] = useState(false);
    let [playing, setPlaying] = useState(false);
    let [password, setPassword] = useState(undefined);
    /*
    *out of breath* I'm sorry! I was rushing to put together this content for you.
   I didn't have time to memorize the Nexus' introductory script, so I'm
   just going to read it to you:

   *someone holds up index card at edge of frame*
   Welcome to the journey of a lifetime! I'm here to train you to become
   a CODING WIZARD! 
   
   The first lesson of magic is that wizards have a public name *pause* AND 
   a secret *true* name.
   If someone knows your public name AND your secret true name, they can
   steal all of your spells.

   Remember, your secret true name needs to have a lower case letter, an
   upper case letter, a special character, a number, another lower case
   letter and any of the additional random constraints that the Nexus 
   lists below.

   *index card is put down, pause*

   And just between you and me, the Nexus analytics show that this step is
   where most users drop off. And it counts against me everytime one of my
   students leaves before they've even started. So look I know you don't even
   know me, and I know I'm just a sock puppet, but could you please 
   enter a password... It would mean a lot to me. I would owe you a favor.

    */
  
    return (
      <SBS
        leftSideTitle={
          <>
            <Typography paragraph>From <SockPuppetChip /> to <FakeChip name={props.username} level={1} /></Typography>
            <Typography >Subject: Your TRUE wizard name!</Typography>
          </>}
        leftSide={
          <>
          <div style={{backgroundColor: "black"}}>
            <ReactPlayer
              playsInline
              fluid={false}
              width={"100%"}
              url="https://codespells-org.s3.amazonaws.com/NexusVideos/e2-sock-2.mp4"
              controls={true}
              style={{}}
              playing={playing}
              onEnded={() => setVideoFinished(true)}
              progressInterval={100}
              onProgress={(p) => { }}
            />
          </div>
          </>
        }
        rightSide={videoFinished ?
          <Fade in={true} timeout={1000}>
            <div>
            <Typography paragraph>
              Dear {props.username},
            </Typography>
            <Typography paragraph>
              I promise that if you do this for me, I'll make it up to you.   
            </Typography>
            <Typography paragraph>
              - Sock Puppet
            </Typography>
            <Typography paragraph>
              P.S. Don't use a "true name" you use on other sites.
            </Typography>
            <PasswordInput setCanContinue={props.setCanContinue}>
            </PasswordInput>
            </div>
          </Fade> : ""}
      />

    )
  }

function PasswordInput(props) {
    let [passwordInput, setPasswordInput] = useState(undefined);
    let [passConfirmInput, setPasswConfirmInput] = useState(undefined);

    return (<>
              <form  noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="True Name"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      inputRef={passwordInput}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="confirm-password"
                      label="Confirm True Name"
                      type="password"
                      id="confirm-password"
                      autoComplete="current-password"
                      inputRef={passConfirmInput}
                    />
                  </Grid>
                </Grid>
              </form>
            </>)
  }

const MeetYourTeacher = (props) => {
  let [darkModeDecisionMade, setDarkModeDecisionMade] = useState(undefined);
  let [username, setUsername] = useLocalStorage("user-name", undefined);
  let [usernameDecisionMade, setUsernameDecisionMade] = useState(undefined);
  let [teacherDecisionMade, setTeacherDecisionMade] = useState(undefined);
  let [teacherReflectionDone, setTeacherReflectionDone] = useState(undefined);

  let reallyContinue = () => {
              setCanContinue(false);
    setCurrentPart(1 + currentPart)
  }

  function LightOrDark(props) {
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

                          props.setCanContinue(true)
                        }}
                      /></div>
                  </Fade>
                </Grid>
              </Grid>
            </>)
  }


  function Level1CompleteScreen(props) {
    return (
            <>
              <p>Congratulations! You've completed Level 1! You're on your way to being a Mage!</p>
              <Button onClick={() => { }}>Continue</Button>
            </>
    );
  }


  //let setTitle = props.setTitle
  const [currentPart,setCurrentPart] = useLocalStorage("lvl1:currentPart", 0)
  const [canContinue,setCanContinue] = useState(false)


  return (
            <>
              {currentPart == 0 && !canContinue ? <Gong /> : "" /* First visit */}
              <CardContent>
                {[
                  <UserNameForm setCanContinue={setCanContinue} setUsername={setUsername} username={username} />,
                  <LightOrDark setCanContinue={setCanContinue} />,
                  <ChooseYourTeacher setCanContinue={setCanContinue} />,
                  <SockPuppetTeacherIntroduction setCanContinue={setCanContinue} username={username} />,
                  <PleaseWaitWhileSockPuppetCreatesContent setCanContinue={setCanContinue} username={username} />,
                  <Level1CompleteScreen />][currentPart]}
              </CardContent>


              <CardActions>
                {currentPart ?
                  <Button key="back-button" onClick={() => { setCurrentPart(currentPart - 1); setCanContinue(false) }}>Back</Button> :
                  ""}

                {canContinue ?
                  <ContinueButton key="continue-button" onClick={reallyContinue} />
                  : ""}
              </CardActions>
            </>
  );
 }

const SBS = (props) => {
  return (
            <>
              <Card>
                <CardHeader title={
                  <span style={{ fontSize: 16 }}>
                    {props.leftSideTitle}
                  </span>
                }></CardHeader>
                {props.leftSide}
              </Card>
              <Card style={{ height: "100%" }}>
                <CardContent>
                  {props.rightSide}
                </CardContent>
              </Card>
            </>)
}

/* Character Creation Mode
Toggle: Choose Light or Dark Mage
Choose a unique Wizard name (acct name) -> tell you if name is already taken
MEET YOUR TEACHER! (Googly eye sock puppet)
First law of magic: Choose a secret name (mini password lesson, special character and number)
*/
function Level1(props) {
  const [titleScreenComplete, setTitleScreenComplete] = useState(false);
  const [title, setTitle] = useState("Character creation");
  let [step, setStep] = useState(0);
    
    useEffect(() => {
      setTimeout(()=>setStep(1), 1000)
      setTimeout(()=>setStep(2), 3000)
      setTimeout(()=>setStep(3), 6000)
    },[])

  const TitleScreen = (props) => {

    return (
      <>
        <Fade in={true} timeout={1000}>
          <Card style={{ margin: 0, position: "absolute", top: "50%", left: "50%", msTransform: "translate(-50%,-50%)", transform: "translate(-50%,-50%)" }}>
            <CardContent>
              {step >= 1 ?
              <div style={{ textAlign: "center", padding: "20px 40px 20px 40px" }}>
                <h1>CodeSpells: The Nexus</h1>
                <h2>A Game By ThoughtSTEM</h2>
              </div>
                : ""}
              {step >= 2 ?
                <div style={{ textAlign: "center"}}>
                  <Typography paragraph>Would you like to play?</Typography>
                </div>
                 : ""}
            </CardContent>
            <CardActions>
              {step >= 3 ?
                <ContinueButton onClick={() => setTitleScreenComplete(true)} />
                : ""}
            </CardActions>
          </Card>
        </Fade>
      </>

    );
  }
  
  return (!titleScreenComplete ? <TitleScreen/> :
  <Level setBadges={props.setBadges} number={1} subtitle={title} >
    <MeetYourTeacher key="meet-your-teacher" setTitle={setTitle} />
  </Level>)
}

export default Level1
