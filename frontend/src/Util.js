import React, { useEffect } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import useStyles from './styles.js';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';



export function titleCase(str) {
  str = str.toLowerCase();
  str = str.split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' '); 
}

export function kabobCaseToTitleCase(str) {
  str = str.toLowerCase();
  str = str.split('-');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' '); 
}


export function textTrim(text, length){
  if (!text) return '';

  if(text.length > length){
    return text.slice(0, length) + '...';
  } else {
    return text;
  }
}

export function SearchBar(props) {
  const classes = useStyles();

  const [searchIcon, setSearchIcon] = React.useState(true)
  const [focus, setFocus] = React.useState(false)

  const handleSearchIconClick = () => {
    setFocus(!focus)
    setSearchIcon(!searchIcon);
  };
  
  function onSearchIconChange(event) {
    props.setSearch(event.target.value)
    props.setCurrentPage(1)
  }

  return (
    <>       
      <InputBase
        className={clsx(classes.searchField, searchIcon && classes.searchFieldHidden)}
        placeholder="Search Spells"
        onChange={onSearchIconChange}
        inputProps={{ 'aria-label': 'search' }}
        inputRef={(input) => {
          if (input != null) {
            input.focus();
          }
        }}
      />
      <IconButton
        onClick={(event) => handleSearchIconClick()}
        aria-label = "search icon"
      >
        <SearchIcon />
      </IconButton>
    </>
  )
}

//Badge success popup
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function CustomizedSnackbars() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.snackbarRoot}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      {/* severity setting/color: error/red, warning/orange, info/blue, succecss/green */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info">
          You conjured a badge! View your mage page for more details on it.
        </Alert>
      </Snackbar>
    </div>
  );
}