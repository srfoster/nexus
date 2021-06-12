import React, { useEffect, useState } from 'react';
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


const ContinueButton = (props) => {
  return (
    <Fade in={true} timeout={1000}>
      <Button color="secondary" style={{marginLeft: "auto"}} onClick={props.onClick}>Next</Button>
    </Fade>
  );
 }

  const UserNameForm = (props) => {
    const [usernameConfirmed, setUsernameConfirmed] = useState(undefined);
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState(false);
    const [username, setUsernameLocal] = useState(undefined);

    function checkAvailability(){
      setChecking(true)

      //Would do network call here...
      setTimeout(()=>{
        setChecking(false) 
        setAvailable(true) 

        //Causing annoying re-render...
        //setUsername(username); 
        props.setCanContinue(true)
      },1000)
    }
 
    function OneMoment(props) {
      return (
        <Typography>One moment...</Typography>
      )
    }

    function UsernameInput(){
    return (
      available ?
        <Chip avatar={<AccountCircle />}
          label={username} />
        : (<TextField
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
        )
      )
  }

    return (<Grid container spacing={1}>
      <Grid item xs={6} >
        <Typography>What shall we call you?</Typography>
      </Grid>
      <Grid item xs={6}>
      {checking ? OneMoment() :  UsernameInput() 
      
      }

      {username === undefined || checking ? "" :
        <Fade key="check-available" in={true} timeout={1000}>
          <Button size="small" onClick={() => {
          if(!available){
            checkAvailability()
          } else{
            setAvailable(undefined)
            props.setCanContinue(false)
          }
        }
        }>{!available ? "Check Availability" : "Undo?"}</Button>
        </Fade>}

      </Grid>
    </Grid>)
  }

const MeetYourTeacher = (props) => {
  let [darkModeDecisionMade, setDarkModeDecisionMade] = useState(undefined);
  let [username, setUsername] = useState(undefined);
  let [usernameDecisionMade, setUsernameDecisionMade] = useState(undefined);
  let [teacherDecisionMade, setTeacherDecisionMade] = useState(undefined);
  let [teacherReflectionDone, setTeacherReflectionDone] = useState(undefined);
  let [password, setPassword] = useState(undefined);

  
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
    })

    return (<>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Fade in={true} timeout={1000}>
            <p style={{ marginBottom: 10 }}>In the nexus,
            <br/>
            Your preferences matter</p>
          </Fade>
        </Grid>
        <Grid item xs={6}>
          <Fade in={true} timeout={2000}>
            <div>
              <p style={{ marginBottom: 0 }}>Light or Dark?</p>
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


  function MultipleChoiceQuestion(props) {
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState(false);
    const [helperText, setHelperText] = React.useState('Choose wisely');
    
    const handleRadioChange = (event) => {
      setValue(event.target.value);
      setHelperText(' ');
      setError(false);
    };

    const handleSubmit = () => {
      let selection = props.answers.filter((e) => e.text == value)[0]
      setHelperText(selection.feedback);
      setError(!selection.correct);
      if (selection.correct) {
        props.onCorrect();
      }
    }

    return (
      <>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" error={error}>
            <FormLabel component="legend">{ props.question }</FormLabel>
            <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
              {props.answers.map((e) => { return <FormControlLabel value={e.text} control={<Radio />} label={ e.text } /> })}
            </RadioGroup>
            <FormHelperText>{helperText}</FormHelperText>
          </FormControl>
        </form>
        <Button onClick={handleSubmit} type="submit" variant="solid" color="primary">{ props.buttonText }</Button>
      </>
    );

  }

  function ChooseYourTeacher(props) {
    const [teacherAvailable, setTeacherAvailable] = React.useState(false);

    return (
      <>
        <MultipleChoiceQuestion question="Which is your preferred teacher?" answers={[
          { correct: true, text: "Sock Puppet", feedback: "It's available!" },
          { correct: false, text: "A Wizard from the Forest", feedback: "Sorry, your current level is too low to unlock this teacher." },
          { correct: false, text: "Super Intelligent AI", feedback: "Sorry, your current level is too low to unlock this teacher." },
          { correct: false, text: "The Creators of nexus.codespells.org", feedback: "Sorry, your current level is too low to unlock this teacher." },
          { correct: false, text: "None of these", feedback: "Sorry, your current level is to low for you to continue without a teacher." },
        ]}
          buttonText="Check Availability"
          onCorrect={()=>props.setCanContinue(true)}
          onIncorrect={()=>props.setCanContinue(false)}
        />
      </>
    );
  }

  //Choose your username
  function SockPuppetTeacherIntroduction(props) {
    let [videoFinished, setVideoFinished] = useState(false);
    let [playing, setPlaying] = useState(false);

    return (
      <SBS
        leftSideTitle={<>You've unlocked:<Chip avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />} label="Sock Puppet"></Chip></>}
        leftSide={
          <>
            <ReactPlayer
              playsInline
              fluid={false}
              width={"100%"}
              url="https://codespells-org.s3.amazonaws.com/NexusVideos/e1-sock-2.mp4"
              controls={true}
              style={{}}
              playing={playing}
              onEnded={() => setVideoFinished(true)}
              progressInterval={100}
              onProgress={(p) => { }}
            />
          </>
        }
        rightSide={videoFinished ?
          <><WhyIsMyTeacherASock setCanContinue={ props.setCanContinue } />
          </> : ""}
      />
    );
  }
 
  // Decision: Do we need this question? What purpose does it serve?
  // Pro: breaks up video content, nice gamification rhythm
  function WhyIsMyTeacherASock(props) {
    return (
      <>
        <MultipleChoiceQuestion
          question="Your feelings matter.  Do you think a sock can teach?"
          answers={[
            {
              correct: true, text: "Yes, if a sock can't teach something, it cannot be taught!",
              feedback: `Personality assessment result: User with name "${username}" is an optimist who likes socks.  User may continue.`
            },
            {
              correct: true, text: "Yes, socks can teach you what NOT to do.",
              feedback: `Personality assessment result: User with name "${username}" harbors mild anti-sock tendencies and should be monitored.  User may continue.`
            },
            {
              correct: true, text: "No, socks are inanimate objects",
              feedback: `Personality assessment result: User with name "${username}" considers themselves to be far superior to socks.  Recommended for sock sympathy training.  User may continue.`
            },
            {
              correct: true, text: "No, I do not trust socks",
              feedback: `Personality assessment result: User with name "${username}" has likely had bad experiences with socks in the past.  Recommended for sock exposure therapy.  User may continue.`
            },
            {
              correct: false, text: "These answers are too restrictive",
              feedback: `Personality assessment result: User with name "${username}" is a narcisist who thinks their snowflake-like personality is too complex to be assessed by multiple-choice questions. User may not continue.`
            },
          ]}
          buttonText="Submit Answer"
          onCorrect={() => props.setCanContinue(true)}
          onIncorrect={() => props.setCanContinue(false)}
        />
      </>
    )
  }

  function SockPuppetPasswordLesson(props){
    let [videoFinished, setVideoFinished] = useState(false);
    let [playing, setPlaying] = useState(false);

    return(
      <SBS
        leftSideTitle={<p>Are you ready for your first lesson? Sock Puppet is going to teach you the First Rule of magic.</p>}
        leftSide={
          <>
            <ReactPlayer
              playsInline
              fluid={false}
              width={"100%"}
              url="https://codespells-org.s3.amazonaws.com/NexusVideos/e1-sock-2.mp4"
              controls={true}
              style={{}}
              playing={playing}
              onEnded={() => setVideoFinished(true)}
              progressInterval={100}
              onProgress={(p) => { }}
            />
          </>
        }
        rightSide={videoFinished ?
          <><PasswordInput setCanContinue={ props.setCanContinue} />
          </> : ""}
      />

    )
  }

  function PasswordInput(props){
  
    return (<>
      <h1 onClick={ () => props.setCanContinue(true) }>Put your password here...</h1>
       
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
  const [currentPart,setCurrentPart] = useState(0) 
  const [canContinue,setCanContinue] = useState(false) 

  
  return (
    <>
      <CardContent>
        {[
          <UserNameForm setCanContinue={setCanContinue} />,
          <LightOrDark setCanContinue={setCanContinue} />,
          <ChooseYourTeacher setCanContinue={setCanContinue} />,
          <SockPuppetTeacherIntroduction setCanContinue={setCanContinue} />,
          <SockPuppetPasswordLesson setCanContinue={setCanContinue} />,
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
            { props.leftSide }
          </Card>
          <Card style={{ height: "100%" }}>
            <CardContent>
              {props.rightSide }
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
  const [title, setTitle] = useState("Character creation");
  return (<Level setBadges={props.setBadges} number={1} subtitle={title} >
    <MeetYourTeacher key="meet-your-teacher" setTitle={setTitle}  />
  </Level>)
}

export default Level1
