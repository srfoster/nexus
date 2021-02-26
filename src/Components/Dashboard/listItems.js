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

export default function MainListItems() {
  let history = useHistory();

  const handleClickButton = (path) => {
    history.push(path)
    if(path === '/login') TokenService.clearAuthToken();
  }

  return (
    <>
      <div>
        {/* <ListSubheader inset>Main header</ListSubheader> */}
        <ListItem button onClick={() => handleClickButton('/spells')}>
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText primary="My Spells" />
        </ListItem>

        {/* <ListItem button onClick={() => handleClickButton('/create')}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="New Spell" />
        </ListItem> */}

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
          <ListItemText primary="All Spells" />
        </ListItem>
      </div>
      <Divider />
      <div>
        {/* <ListSubheader inset>Secondary header</ListSubheader> */}
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
