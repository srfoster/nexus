import React, { useEffect, useState } from 'react';
import DarkModeSwitch from '../../Widgets/DarkModeSwitch';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

function Step3LightOrDark(props) {
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

export default Step3LightOrDark;