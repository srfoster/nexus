import React, { useEffect, useState } from 'react';
import TokenService from '../Services/token-service';
import config from '../config';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';

const UserProfile = (props) => {
  const classes = useStyles();
  const [user, setUser] = useState(undefined)
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = React.useState('');
  const [searchIcon, setSearchIcon] = React.useState(true);

  const handleSearchIconClick = () => {
    setSearchIcon(!searchIcon);
  };


  useEffect(() => {
    const { id } = props.match.params

    SpellsApiService.getUserById(id, currentPage, search)
      .then(user => {
        setUser(user)
      })
  },[currentPage, search])

  function onSearchIconChange(event) {
    setSearch(event.target.value)
  }

  function SearchAppBar() {
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

  return (
    user ?
      <>
        <div className={classes.headBar}>
          <div className={classes.headLeft}></div>
          <div className={classes.headTitle}>{`Spellbook of ${user.username}`}</div>
          <div className={classes.headRight}>{SearchAppBar()}</div>
        </div>
        <Spellbook spells={user.spells}/>
        <Title>
            <div className={classes.root}>
              <Pagination count={Math.ceil(user.total / rowsPerPage)}
                onChange={(event ,page ) => {setCurrentPage(page)}}
               // //function(event: object, page: number) => void
              // //event: The event source of the callback.
              // //page: The page selected.
              />
            </div>
        </Title>
      </>
    : ''
  );
};

const useStyles = makeStyles((theme) => ({
name: {
  textAlign: "left",
},
root: {
  '& > *': {
    marginTop: theme.spacing(2),
    display: 'flex',
  justifyContent: 'center',
  },
},
headBar: {
  justifyContent: 'space-between',
  fontSize: '1.5rem',
  display: 'inline-flex',
  width: 'auto',
  fontFamily: "Roboto",
  fontWeight: '400',
  lineHeight: '1.334',
  letterSpacing: '0em',
  color: '#3f51b5',
},
headLeft: {
  flexGrow: '5',
  display: 'inline-flex',
},
headTitle: {
  flexGrow: '3',
  display: 'inline-flex',
},
headRight: {
  flexGrow: '1',
  width: '120px',
  display: 'inline-flex',
  justifyContent: 'flex-end',
},
searchField: {
  width: '114px',
},
searchFieldHidden: {
  width: '0px',
},
}));

export default UserProfile;
