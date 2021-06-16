import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

function Level33(props) {

  return (
    <Level number={33} subtitle={"Blank Level Template"}>
      <React.Fragment>
      {/* <ContinueButton
        onComplete={() => {
          props.setBadges(props.badges.concat([{ name: props.badgeName }]));
        }}
      ></ContinueButton> */}
      </React.Fragment>
    </Level>
  );
}

export default Level33;