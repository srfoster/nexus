import React, { useEffect, useState } from 'react';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import {SearchBar} from '../Util.js'

const UserProfile = (props) => {
  const classes = useStyles();
  const [user, setUser] = useState(undefined)
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = React.useState('');

  useEffect(() => {
    let isMounted = true
    const { id } = props.match.params

    SpellsApiService.getUserById(id, currentPage, search)
      .then(user => {
        if(isMounted) setUser(user)
      })
      return () => {
        isMounted = false
      }
  },[currentPage, search])

  return (
    user ?
      <>
        <div className={classes.headBar}>
          <div className={classes.headLeft}></div>
          <div className={classes.headTitle}>{`Spellbook of ${user.username}`}</div>
          <div className={classes.headRight}><SearchBar setSearch={setSearch}/></div>
        </div>
        <Spellbook spells={user.spells}/>
        <Title>
            <div className={classes.root}>
              <Pagination count={Math.ceil(user.total / rowsPerPage)}
                onChange={(event ,page ) => {setCurrentPage(page)}}
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
