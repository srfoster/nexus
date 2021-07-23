import React, { useEffect, useState } from 'react';
import Fade from '@material-ui/core/Fade';
import { FakeTeacherChip, SockPuppetChip, SpinThen } from '../../Widgets/NexusVoice';
import Grid from '@material-ui/core/Grid';
import { MultipleChoiceQuestion } from '../../Widgets/Educational';
import Typography from '@material-ui/core/Typography';

function Step4ChooseYourTeacher(props) {
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

export default Step4ChooseYourTeacher;