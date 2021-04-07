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
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import Dashboard from './Dashboard';

export function PublicListItems(props) {
  let history = useHistory();

  const handleClickButton = (path) => {
    if(path === '/login') TokenService.clearAuthToken();
    history.push(path)
  }  

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  function handleKeyUp(event) {
    if(event.keyCode === 13) {
        // addTagToSpell(spell.id, spellTag)
        console.log('One Step Closer')
        // setSpellTag("")
    }
  }



  // function SearchAppBar() {
  //   const classes = useStyles();

  //   return (

       
  //     // <ListItem>
  //     //   <ListItemIcon>
  //     //     <SearchIcon />
  //     //   </ListItemIcon>
  //     //   <ListItemText>
  //     //     <InputBase
  //     //       onKeyUp={handleKeyUp}
  //     //       placeholder="Search Spells"
  //     //       inputProps={{ 'aria-label': 'search' }}
  //     //     />
  //     //   </ListItemText> 
  //     //   </ListItem>
  //   )
  // }

  return (
    <>
      <div>
        {/* <ListSubheader inset>Main header</ListSubheader> */}
        
        {/* {SearchAppBar()} */}
        
        <ListItem button onClick={() => handleClickButton('/spells')}>
          <ListItemIcon>
            <CodeIcon />
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