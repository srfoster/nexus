import React from 'react';
import { useHistory } from "react-router-dom";
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
import {TwitchIcon} from '../../Assets/TwitchIcon.png';

export function PublicListItems(props) {
  const classes = useStyles();
  let history = useHistory();

  const handleClickButton = (path) => {
    if(path === '/login') TokenService.clearAuthToken();
    history.push(path)
  }  

  return (
  <>
    <div>
    
    <ListItem button onClick={() => handleClickButton('/spells')}>
      <ListItemIcon>
        <ViewListIcon />
      </ListItemIcon>
      <ListItemText primary="My Spells" />
    </ListItem>

    <ListItem button onClick={() => handleClickButton('/friends')}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Friends" />
    </ListItem>

    <ListItem button onClick={() => handleClickButton('/gallery')}>
      <ListItemIcon>
        <PhotoAlbumIcon />
      </ListItemIcon>
      <ListItemText primary="Public Spells" />
    </ListItem>
    </div>
    <Divider />
    <div>
    <ListItem button
      onClick={() => handleClickButton('/wizards/me')}
      >
      <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="My Profile" />
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
  let history = useHistory();

  const handleClickButton = (path) => {
  history.push(path)
  if(path === '/login') TokenService.clearAuthToken();
  }

  return (
  <>
    <div>
    <ListItem button onClick={() => handleClickButton('/gallery')}>
      <ListItemIcon>
      <PhotoAlbumIcon />
      </ListItemIcon>
      <ListItemText primary="Public Spells" />
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