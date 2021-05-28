import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import SpellsApiService from '../Services/spells-api-service';
import useStyles from '../styles.js';
import Paper from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import Tooltip from '@material-ui/core/Tooltip';


export default function FollowCard(props) {
  const classes = useStyles();
  let history = useHistory();
  const [user, setUser] = useState(undefined)
  const {follow} = props
  let path = window.location.pathname

  useEffect(() => {
    let isMounted = true
    const { follower_id } = follow
  
    SpellsApiService.getUserById(follower_id)
      .then(user => {
        if(isMounted) setUser(user)
      })
      return () => {
        isMounted = false
      }
  },[path])

  
  return (
    <>
    {user && (<div className={classes.root}>
      <Paper className={classes.followCard} position="static">
        <Toolbar className={classes.followCardBody}>
          <Tooltip title={`Go to Mage Page`}> 
            <Typography onClick={() => history.push(`/wizards/${user.id}`)} variant="h6">
                {`${user.username}`}
              </Typography>
          </Tooltip> 
          <Tooltip title={`unfollow ${user.username}`}>
            <IconButton aria-label="remove-mage" onClick={() => props.deleteFollow('me', user.id)}>
              <PersonAddDisabledIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Paper>
    </div>)}
    </>
  );
}
