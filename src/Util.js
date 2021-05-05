import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import useStyles from './styles.js';
import React, { useEffect } from 'react';


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

  const handleSearchIconClick = () => {
    setSearchIcon(!searchIcon);
  };
  
  function onSearchIconChange(event) {
    props.setSearch(event.target.value)
  }

  return (
    <>       
      <InputBase
        className={clsx(classes.searchField, searchIcon && classes.searchFieldHidden)}
        placeholder="Search Spells"
        onChange={onSearchIconChange}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton 
        onClick={(event) => handleSearchIconClick()}
      >
        <SearchIcon />
      </IconButton>
    </>
  )
}
