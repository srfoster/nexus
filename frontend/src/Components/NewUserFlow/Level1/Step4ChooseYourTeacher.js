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
            <MultipleChoiceQuestion question="Which School of Magic would you prefer to join?" answers={[
              { correct: true, text: "School of Witchcraft", feedback: <SpinThen spinTime={500}>Available!</SpinThen> },
              { correct: true, text: "School of the Druids", feedback: <SpinThen spinTime={1000}>Available!</SpinThen> },
              { correct: true, text: "School of the Dark Arts", feedback: <SpinThen spinTime={1000}>Available!</SpinThen>},
              { correct: true, text: "School of Elemental Magic", feedback: <SpinThen spinTime={1000}>Available!</SpinThen> },
              { correct: false, text: "None of these", feedback: <SpinThen spinTime={5000}>Sorry, your current level is too low for you to continue without a school.</SpinThen> },
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