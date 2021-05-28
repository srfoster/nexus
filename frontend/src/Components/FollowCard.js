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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FollowCard(props) {
  const classes = useStyles();
  let history = useHistory();
  const [user, setUser] = useState(undefined)
  const [open, setOpen] = React.useState(false);
  const {follow} = props
  let path = window.location.pathname

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDisagree = () => {
    setOpen(false);
  };

  const handleCloseAgree = () => {
    setOpen(false);
    props.deleteFollow('me', user.id)
  };


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
            <IconButton aria-label="remove-mage" onClick={handleClickOpen}>
              <PersonAddDisabledIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Paper>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDisagree}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Do you really want to unfollow this mage?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You can only follow them back once you land upon their mage page again. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDisagree} color="primary">
            Disagree
          </Button>
          <Button onClick={handleCloseAgree} color="primary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>)}
    </>
  );
}
