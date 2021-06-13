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
        <Fade in={true} timeout={ 1000 }>
          <>
            <FormControl component="fieldset" error={error}
            style={{display:"flex", ...props.style}}>
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
        <Button size="small" onClick={ props.onOpenClicked() }>Open?</Button>
      </Grid>
    </Fade>
  </Grid>)
}

  function SockPuppetChip(){
    return <Chip avatar={<Avatar alt="Sock Puppet" src="/static/images/avatar/1.jpg" />} label="Sock Puppet (Lvl 0)"></Chip>
  }

  function FakeChip(props){
    return <Chip avatar={<Avatar alt={props.name} src="/static/images/avatar/1.jpg" />} label={<span>{props.name} { " (Lvl " + (10 * (props.level !== undefined ? props.level : props.name.length)) + ")"}</span>}></Chip>
  }

const ContinueButton = (props) => {
  return (
    <Fade in={true} timeout={1000}>
      <Button color="secondary" style={{marginLeft: "auto"}} onClick={props.onClick}>Next</Button>
    </Fade>
  );
 }

  const UserNameForm = (props) => {
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useLocalStorage("user-name-available", undefined);
    const [username, setUsernameLocal] = useState(props.username);

    useEffect(()=>{
      if(username && available){
        props.setCanContinue(true)
      }
    },[])

    function checkAvailability(){
      setChecking(true)

      //Would do network call here...
      setTimeout(()=>{
        setChecking(false) 
        setAvailable(true) 

        //Causing annoying re-render...
        props.setUsername(username); 
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
          <Typography>What shall we call you?</Typography>
      </Grid>
      </Fade>
      <Fade in={true} timeout={2000}>
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
              <Typography>In the nexus,
                <br />
                we try to accomodate...
              </Typography>
            </Grid>
          </Fade>
          <Fade in={true} timeout={2000}>
            <Grid item xs={6}>
              <MultipleChoiceQuestion question="Select your teacher preference" answers={[
                { correct: true, text: <SockPuppetChip />, feedback: "Available!" },
                { correct: false, text: <FakeChip name="Wizard of the Forest" />, feedback: "Sorry, your current level is too low for you to perfer this teacher." },
                { correct: false, text: <FakeChip name="Super-intelligent AI" />, feedback: "Sorry, your current level would make the super intelligent AI laugh." },
                { correct: false, text: <FakeChip name={<span>The Nexus Devs</span>} />,feedback: "Sorry, your current level is too low for us to bother the Devs at this time." },
                { correct: false, text: "None of these", feedback: "Sorry, your current level is to low for you to continue without a teacher." },
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
        <Typography pargraph>I'm one of the Nexus's staff members.  I've written this personalized message to accompany the personalized introduction video above.</Typography>
        <br />
        <Typography pargraph>At the Nexus, we pride ourselves on how personal everything is.</Typography>
        <br />
        <Typography pargraph>Because I'm a Level 1 teacher, I'm authorized to include the attached personality quiz that accompanies this message!  Please take it. :SmileEmoji:</Typography>
        <br />
        <Typography pargraph>It was automatically generated by the Nexus!</Typography>


        <br />
        <Typography pargraph>Sincerely,</Typography>
        <Typography pargraph>Sock Puppet</Typography>
        <MultipleChoiceQuestion style={{marginTop: 50}}
          question="Your feelings matter.  Do you think a sock can teach?"
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
          <Typography paragraph>From <SockPuppetChip /> to <FakeChip name={props.username} level={0} /></Typography>
          <Typography >Subject: Video Introduction!</Typography>
          </>}
          leftSide={
            <div style={{backgroundColor: "black"}}>
              <ReactPlayer
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
            </div>
          }
          rightSide={
            videoFinished ?
              <><WhyIsMyTeacherASock setCanContinue={props.setCanContinue} username={props.username} /></> : ""}
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
    useEffect(()=>{
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

    return (<div>
      {step >= 1 ? <Fade in={true}><Typography paragraph>Please wait...</Typography></Fade> : ""}
      {step >= 2 ?
        <Typography paragraph>
          <SockPuppetChip /> is making video content!
        </Typography> : ""}
      {step >= 3 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          The Nexus prides itself in its content. 
        </Typography>
      : ""}
      {step >= 4 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          At the Nexus, your experience is our highest priority.   :SmileEmoji:
        </Typography>
      : ""}
      {step >= 5 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          At the Nexus, our teachers are carefully chosen for their teaching ability 
        </Typography>
      : ""}
      {step >= 6 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          and their ability to make fantastic educational content
        </Typography>
      : ""}
      {step >= 7 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          under strict deadlines 
        </Typography>
      : ""}
      {step >= 8 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          that the Nexus strives for in our continuing mission
        </Typography>
      : ""}
      {step >= 9 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          to meet your educational needs 
        </Typography>
      : ""}
      {step >= 10 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          ...
        </Typography> : ""
      }
      {step >= 11 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          Sometimes our low-level teachers, like <SockPuppetChip />
        </Typography> : ""
      }
      {step >= 12 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          may not always meet the expected deadlines 
        </Typography> : ""
      }
      {step >= 13 ? 
        <Typography pargraph style={{marginBottom: 30}}>
          that we strive for
        </Typography> : ""
      }
      {step >= 14 ?
        <NewMessageNotification
          nexusSays={"Ah, here we go!"} 
          from={<SockPuppetChip />}
          onOpenClicked={()=>{console.log("HI")}}
          />  : ""
      }

      {step < 14 ? <CircularProgress style={{marginTop: 20}} /> : ""}

      </div>)

  }
 

const MeetYourTeacher = (props) => {
  let [darkModeDecisionMade, setDarkModeDecisionMade] = useState(undefined);
  let [username, setUsername] = useLocalStorage("user-name", undefined);
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
    }, [])

    return (<>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Fade in={true} timeout={1000}>
            <Typography style={{ marginBottom: 10 }}>In the nexus,
            <br/>
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
  const [currentPart,setCurrentPart] = useLocalStorage("lvl1:currentPart", 0) 
  const [canContinue,setCanContinue] = useState(false) 

  
  return (
    <>
      {currentPart == 0 && !canContinue ? <Gong /> : "" /* First visit */}
      <CardContent>
        {[
          <UserNameForm setCanContinue={setCanContinue} setUsername={setUsername} username={username}/>,
          <LightOrDark setCanContinue={setCanContinue} />,
          <ChooseYourTeacher setCanContinue={setCanContinue} />,
          <SockPuppetTeacherIntroduction setCanContinue={setCanContinue} username={username} />,
          <PleaseWaitWhileSockPuppetCreatesContent setCanContinue={setCanContinue} username={username} />,
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
