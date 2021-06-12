import React, { useEffect, useState } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import useStyles from './styles.js';

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

// Hook
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}