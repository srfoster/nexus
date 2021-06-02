import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CodeMirror from 'codemirror';
import {UnControlled as ReactCodeMirror} from 'react-codemirror2';
import ConnectionIndicator from '../Client/ConnectionIndicator';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {linkTo, topDocLink} from './util.js';
import AddBadgeOnRender from '../AddBadgeOnRender';

// TODO
// Need to figure out how to make Download & Setup require the Connected status before
//  moving on...

// Chosen -> Initiate -> Novice -> Apprentice -> Adept 

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Intro', 'Download & Setup', 'Casting Spells', 'Editing Spells'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Intro/>;
    case 1:
      return <DownloadAndSetup/>;
    case 2:
      return <CastingSpells/>;
    case 3:
      return <EditingSpells/>;
    default:
      return 'Unknown step';
  }
}

function Intro(props){
    return (<>
        <p>We think the best way to get started with CodeSpells is to cast a spell as soon as possible.</p>

        <p>You should know that whenver we say "cast a spell", we simultaneously mean "run some code."  In CodeSpells, code and spells are the same.</p>

        <p>Here's the spell we are going to cast:</p>

        <ReactCodeMirror
            value={
                `(loop 

  (define foods (find-all-nearby))

  (map (lambda (f)
	 (eat f 100))
	foods)

  )`
            }
            options={{
                lineWrapping: true,
                mode: 'scheme',
                theme: 'material',
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true,
            }}
        />
    </>
    );
}

function DownloadAndSetup(props){
    return (<>
        <p>But first, you're gonna have to download a CodeSpells world. Download Orb World <a href="https://codespells-org.s3.amazonaws.com/StandaloneBuilds/orb-world/0.0/OrbWorld.7z">here</a>.</p>
        <p>Unzip the downloaded file and double click the executable <tt>main.exe</tt> that downloaded to your computer. When the game starts, you should notice the connection indicator below say "Connected".</p>
        <ConnectionIndicator />
    </>);
}

function CastingSpells(props){
    return(<>
        <p>Yay! You got connected! Good job!</p>
        <p>Now, we're going to cast some spells in the game! This is a Cast button:</p>
        <CastButton code={`(color "green")`}/>
        <p>Anytime you see a Cast button, you can click it and cast a spell in game. This one is going to be a mystery. Cast it and see what happens!</p>
    </>);
}

function EditingSpells(props){
  return(<>
        <p>When you clicked the Cast button in the last step, you should have seen a new orb spawn near you that's green! You can click as many times as you want and spawn lots of orbs!</p>
        <p>You'll usually see the Cast button inside a code editor. You can edit the code before casting a spell in-game. Try to change the color of the spawned orb to red:</p>
        <MagicMirror code={`(color "red")`}/>
  </>);

}

function GettingStarted(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
    //This would set the 2nd step to be optional:
    //return step === 1;
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
          {topDocLink}
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              You did it! You cast your first spell! Now, head over to your Spells page to start making your own!  
            </Typography>
            <AddBadgeOnRender name='Getting-Started'/>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MagicMirror(props) {
    const [code, setCode] = useState(props.code);

    return <>
        <ReactCodeMirror
            value={
                props.code
            }
            options={{
                lineWrapping: true,
                mode: 'scheme',
                theme: 'material',
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true,
            }}
            onChange={(editor, data, value) => {
                setCode(value);
            }}
        />
        <CastButton code={code} />
    </>
}

function CastButton(props) {
    return <><Button
        onClick={() => {
            window.CodeSpellsSocket.send(props.code);
        }}
        variant="contained"
        color="secondary">
            Cast
        </Button></>
}

export default GettingStarted;