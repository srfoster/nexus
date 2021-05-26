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

function FollowAddIcon(props) {
const {user, setUser ,follow, setFollow, isLoading, setIsLoading} = props
 const updateFollow = () => {
    setIsLoading(true)
    setTimeout(() => {setFollow(!follow)}, 1000)
    setTimeout(() => {setIsLoading(false)}, 1000)
 }
 console.log('test 1 ', user)
  return(
      <>
        {isLoading ? 
            <CircularProgress size={48}/>
        : follow ? 
            <Tooltip title={`Add ${user.username}`}>
                <IconButton aria-label="add-mage" onClick={() => updateFollow()}>
                <PersonAddIcon />
                </IconButton>
            </Tooltip>
          :
            <Tooltip title={`Remove ${user.username}`}>
                <IconButton aria-label="remove-mage" onClick={() => updateFollow()}>
                <PersonAddDisabledIcon />
                </IconButton>
            </Tooltip>
            
        }  
    </>
  )
}

export default FollowAddIcon;