import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import SpellsApiService from '../Services/spells-api-service';
import useStyles from '../styles.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { spread } from "../Util.js"


const Transition = React.forwardRef(function Transition(props, ref) {
  return React.createElement(Slide, spread({direction:"up", ref: ref}, props))
});

function FollowAddIcon(props) {
  const [open, setOpen] = React.useState(false);
  const {user, setUser ,follow, setFollow, isLoading, setIsLoading} = props
  const { id } = props.match.params
  const updateFollow = () => {
    setIsLoading(true)
    SpellsApiService.postFollows('me', id)
    .then(() => {
      setTimeout(() => {setFollow(!follow)}, 1000)
    })
    setTimeout(() => {setIsLoading(false)}, 1000)
  }
  const deleteFollow = () => {
    setIsLoading(true)
    SpellsApiService.deleteFollows('me', id)
    .then(() => {
      setTimeout(() => {setFollow(!follow)}, 1000)
    })
    setTimeout(() => {setIsLoading(false)}, 1000)
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDisagree = () => {
    setOpen(false);
  };

  const handleCloseAgree = () => {
    setOpen(false);
    deleteFollow()
  };

  return(
    <>
      {isLoading ? 
          <CircularProgress size={48}/>
      : follow ? 
          <Tooltip title={`Remove ${user.username}`}>
              <IconButton aria-label="remove-mage" onClick={handleClickOpen}>
              <PersonAddDisabledIcon />
              </IconButton>
          </Tooltip>
        :
          <Tooltip title={`Add ${user.username}`}>
              <IconButton aria-label="add-mage" onClick={() => updateFollow()}>
              <PersonAddIcon />
              </IconButton>
          </Tooltip>
      }  
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
            You are unfollowing this mage. To re-follow press the follow button again! 
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
    </>
  )
}

export default FollowAddIcon;
