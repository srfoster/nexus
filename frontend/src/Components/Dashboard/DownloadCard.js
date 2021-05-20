import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import useStyles from "../../styles.js";
import Grid from "@material-ui/core/Grid";
import GetAppIcon from '@material-ui/icons/GetApp';

const DownloadCard = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Grid className={"Card Frame"} item key={"Frame "} xs={12} sm={6} md={4}>
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              Orb Game 1
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Click To Download
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <IconButton aria-label="previous">
              <ChevronRightIcon />
            </IconButton>
            <IconButton aria-label="Download Game" href="https://codespells-org.s3.amazonaws.com/StandaloneBuilds/orb-game-1/0.0/OrbGame1.7z">
              <GetAppIcon className={classes.downloadIcon} />
            </IconButton>
            <IconButton aria-label="next">
              <ChevronLeftIcon />
            </IconButton>
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image="https://i.imgur.com/SDbPuTR.png"
          title="Live from space album cover"
        />
      </Card>
    </Grid>
  );
};

export default DownloadCard;