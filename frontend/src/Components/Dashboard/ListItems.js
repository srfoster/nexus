import React from 'react';
import { useHistory, useParams } from "react-router-dom";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import CodeIcon from '@material-ui/icons/Code';
import Divider from '@material-ui/core/Divider';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PhotoAlbumIcon from '@material-ui/icons/PhotoAlbum';
import TokenService from '../../Services/token-service';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListIcon from '@material-ui/icons/List';
import ViewListIcon from '@material-ui/icons/ViewList';
import useStyles from '../../styles.js';
import { TwitchIcon } from '../../Assets/TwitchIcon.png';
import GetAppIcon from '@material-ui/icons/GetApp';
import Link from '@material-ui/core/Link';
import AssignmentIcon from '@material-ui/icons/Assignment';

export function PublicListItems(props) {
  const classes = useStyles();
  let history = useHistory();
  const [test, setTest] = React.useState(undefined)

  const handleClickButton = (path) => {

    if(path === '/login') TokenService.clearAuthToken();
    history.push(path)
  }  

  let path = window.location.pathname

  return (
  <>
    <div>
    <ListItem button onClick={() => handleClickButton('/spells')} 
      // className={path === '/spells' ? classes.listIcon : ''}
      >
      <ListItemIcon>
        <ViewListIcon />
      </ListItemIcon>
      <ListItemText primary="My Spells" />
    </ListItem>

    <ListItem button onClick={() => handleClickButton('/follows')}
      // className={path === '/friends' ? classes.listIcon : ''}
      >
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Friends" />
    </ListItem>

    <ListItem button onClick={() => handleClickButton('/gallery')}
      // className={path === '/gallery' ? classes.listIcon : ''}
      >
      <ListItemIcon>
        <PhotoAlbumIcon />
      </ListItemIcon>
      <ListItemText primary="Public Spells" />
    </ListItem>
    </div>
    <Divider />
    <div>
    <ListItem button onClick={() => handleClickButton('/wizards/me')}
      // className={path.includes('/wizards') ? classes.listIcon : ''}
      >
      <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="My Profile" />
    </ListItem>
    <ListItem button onClick={() => handleClickButton('/Docs')}
      // className={path === '/downloads' ? classes.listIcon : ''}
      >
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Docs" />
    </ListItem>
    <ListItem button onClick={() => handleClickButton('/downloads')}
      // className={path === '/downloads' ? classes.listIcon : ''}
      >
      <ListItemIcon>
        <GetAppIcon />
      </ListItemIcon>
      <ListItemText primary="Downloads" />
    </ListItem>
    {/* Twitch Tab */}
    {/* <ListItem button
      onClick={() => handleClickButton('/wizards/me')}
      >
      <ListItemIcon >
      <img src='https://i.imgur.com/O6pTizo.png' alt="TwitchIcon" width="24px"></img>
      </ListItemIcon>
      <ListItemText primary="Twitch" />
    </ListItem> */}
    <ListItem button onClick={() => handleClickButton('/login')}>
      <ListItemIcon>
        <PowerSettingsNewIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem>
    </div>
  </>
  )
};

export function PrivateListItems() {
  const classes = useStyles();
  let history = useHistory();

  const handleClickButton = (path) => {
    history.push(path)
    if(path === '/login') TokenService.clearAuthToken();
  }

  let path = window.location.pathname

  return (
  <>
    <div>
    <ListItem button onClick={() => handleClickButton('/gallery')}
      // className={path === '/gallery' ? classes.listIcon : ''}
      >
      <ListItemIcon>
      <PhotoAlbumIcon />
      </ListItemIcon>
      <ListItemText primary="Public Spells" />
    </ListItem>
    <ListItem button onClick={() => handleClickButton('/downloads')}
      // className={path === '/downloads' ? classes.listIcon : ''}
      >
      <ListItemIcon>
        <GetAppIcon />
      </ListItemIcon>
      <ListItemText primary="Downloads" />
    </ListItem>
    </div>

    <Divider />
    <div>
    <ListItem button onClick={() => history.push('/login')}>
      <ListItemIcon>
      <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Login" />
    </ListItem>
    <ListItem button onClick={() => history.push('/signup')}>
      <ListItemIcon>
      <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Signup" />
    </ListItem>
    </div>
  </>
  )
}