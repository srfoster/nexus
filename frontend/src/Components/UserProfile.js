import React, { useEffect, useState } from 'react';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';
import Pagination from '@material-ui/lab/Pagination';
import {SearchBar} from '../Util.js'
import useStyles from '../styles.js';
import { Helmet } from "react-helmet";

const UserProfile = (props) => {
  const classes = useStyles();
  const [user, setUser] = useState(undefined)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('');
  const [badges, setBadges] = useState('');

  let path = window.location.pathname
  useEffect(() => {
    let isMounted = true
    const { id } = props.match.params

    SpellsApiService.getUserById(id, currentPage, search)
      .then(user => {
        if(isMounted) setUser(user)
      })
    SpellsApiService.getBadgesByUser(id)
      
      .then(badges => {
        if(isMounted) setBadges(badges)
      })

    return () => {
      isMounted = false
    }
  },[currentPage, search, path])

  return (
    user ?
      <>
      <Helmet>
        <title>{`${user.username} `}| CodeSpells Nexus</title>
        <meta name="description" content="Download the latest CodeSpells video games. The spells you write here in the Nexus can be cast inside of these games!" />
      </Helmet>
        <div className={classes.userProfileHeadBar}>
          <div className={classes.userProfileHeadLeft}></div>
          <div className={classes.userProfileHeadTitle}>{`Spellbook of ${user.username}`}</div>
          <div className={classes.userProfileHeadRight}>
            <SearchBar 
              setSearch={setSearch}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
        <div>{badges ? badges.map(badge => badge.name) : ''}</div>

        <Spellbook spells={user.spells}/>
        
        <div className={classes.userProfileRoot}>
          <Pagination count={Math.ceil(user.total / rowsPerPage)}
            onChange={(event, page) => {setCurrentPage(page)}}
          />
        </div>
      </>
    : ''
  );
};

export default UserProfile;
