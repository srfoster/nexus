import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Level, ShowAfter } from "./Level";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Fade from '@material-ui/core/Fade';
import ReactPlayer from 'react-player'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import useStyles from '../../styles.js';
import SignupForm from '../../Components/SignupForm';
import DarkModeSwitch from '../Widgets/DarkModeSwitch';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

const ContinueButton = (props) => {
  return (
    <div style={{ textAlign: "center", paddingTop: 20 }}>
      <Fade in={true} timeout={1000}>
        <Button size="small" onClick={props.onClick}>Next</Button>
      </Fade>
    </div>
  );
 }

const MeetYourTeacher = (props) => {
  let [darkModeDecisionMade, setDarkModeDecisionMade] = useState(undefined);
  let [username, setUsername] = useState(undefined);
  let [usernameDecisionMade, setUsernameDecisionMade] = useState(undefined);
  let [teacherDecisionMade, setTeacherDecisionMade] = useState(undefined);
  let [teacherReflectionDone, setTeacherReflectionDone] = useState(undefined);
  let [password, setPassword] = useState(undefined);

  console.log("RENDER", darkModeDecisionMade)

  function LightOrDark(props) {
    //Add sounds effects to Light vs Dark mode
    return (<>
      <Fade in={true} timeout={1000}>
        <div>
          <p style={{marginBottom:10}}>Let's make this cozier...</p>
          <p style={{marginBottom:0}}>Light or Dark?</p>
          <DarkModeSwitch
            onChange={(darkMode) => {
              //Triggers a re-render, so we'll use local storage instead of state
            }}
          />
        </div>
      </Fade>
      {window.localStorage.getItem("dark-mode") ?
        <ContinueButton onClick={() => { setDarkModeDecisionMade(true) }}/> : ""}
    </>)
  }

  function UserNameForm(props) {
    let [usernameConfirmed, setUsernameConfirmed] = useState(undefined);
    return(<div>
      <span>What shall we call you?</span>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>
          <AccountCircle />
        </Grid>
        <Grid item>
          <TextField
            onChange={(e) => 
              setUsername(e.target.value)
            }
            id="input-with-icon-grid" label={<span>Character name</span>} />
        </Grid>
      </Grid>
      {username === undefined ? "" :
        <Fade in={true} timeout={ 1000}><Button onClick={() => setUsernameConfirmed(true)}>Check Availability</Button>
        </Fade>
        }
      {usernameConfirmed === undefined ? "" :
        <ContinueButton onClick={()=> setUsernameDecisionMade(true)}/>
        }
    </div>)
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
          { correct: false, text: "The Creators of this EdTech Software", feedback: "Sorry, your current level is too low to unlock this teacher." },
        ]}
          buttonText="Check Availability"
          onCorrect={()=>setTeacherAvailable(true)}
          onIncorrect={()=>setTeacherAvailable(false)}
        />
        {teacherAvailable ? <ContinueButton onClick={() => setTeacherDecisionMade(true)}/> : ""}
      </>
    );
  }

  //Choose your username
  function SockPuppetPasswordRequester(props) {
    let [videoFinished, setVideoFinished] = useState(false);
    let [playing, setPlaying] = useState(false);

    return (
      <SBS
        leftSideTitle={<>
          <p>Congratulations, you've unlocked Sock Puppet!</p>
        </>}
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
          <><WhyIsMyTeacherASock />
            <ContinueButton onClick={console.log("Finished!")}/>
          </> : ""}
      />
    );
  }
 
  // Decision: Do we need this question? What purpose does it serve?
  // Pro: breaks up video content, nice gamification rhythm
  function WhyIsMyTeacherASock(props) {
    const [response, setResponse] = React.useState(false);
    return (<MultipleChoiceQuestion
      question="Do you think a sock can teach?"
      answers={[
          { correct: true, text: "Yes, if a sock can't teach something, it cannot be taught!", feedback: "Personality assessment result: User with name \"" + username + "\" is an optimist who like socks." },
          { correct: true, text: "Yes, socks can teach you what not to do.", feedback: "" },
          { correct: true, text: "No, socks are inanimate objects.", feedback: "" },
          { correct: true, text: "No, ...", feedback: "" },
        ]}
          buttonText="Submit Answer"
          onCorrect={()=>setTeacherReflectionDone(true)}
          onIncorrect={()=>setTeacherReflectionDone(false)}
    />)
  }
  
  function Level1CompleteScreen(props) {
    return (
      <>
        <p>Sock puppet video congratulating you and graduating you to story time level.</p>
        <Button onClick={() => { }}>Continue</Button>
      </>
    );
  }

  //Choose a password

  return (
    <>
      {(darkModeDecisionMade === undefined) ? <LightOrDark /> :
        (usernameDecisionMade === undefined ? <UserNameForm /> :
          (teacherDecisionMade === undefined ? <ChooseYourTeacher /> :
              (password === undefined ? <SockPuppetPasswordRequester />
                : <Level1CompleteScreen />
            )))}
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
    return(<Level setBadges={props.setBadges} number={1} subtitle={"Character creation"}>
      <MeetYourTeacher />
    </Level>)
}

export default Level1