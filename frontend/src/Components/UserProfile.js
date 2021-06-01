import React, { useEffect, useState } from 'react';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';
import Pagination from '@material-ui/lab/Pagination';
import {SearchBar} from '../Util.js'
import useStyles from '../styles.js';
import { useHistory } from "react-router-dom";
import FollowAddIcon from './FollowAddIcon';

const UserProfile = (props) => {
  const classes = useStyles();
  const [user, setUser] = useState(undefined)
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = React.useState('');
  const [follow, setFollow] = React.useState(undefined)
  const [isLoading, setIsLoading] = React.useState(false)
  let history = useHistory();

  let path = window.location.pathname

  useEffect(() => {
    let isMounted = true
    const { id } = props.match.params
    SpellsApiService.getFollows(id)
    .then(follows => {
      setFollow(follows.is_following)
    })

    SpellsApiService.getUserById(id, currentPage, search)
      .then(user => {
        if(isMounted) setUser(user)
      })
      return () => {
        isMounted = false
      }
  },[currentPage, search, path])
//logged in for profile page
  return (
    user ?
      <>
      {console.log('user number', props.match.params.id),
      console.log('user number 1',user.id)}
      {/* //logged in for profile page */}
        <div className={classes.userProfileHeadBar}>
          <div className={classes.userProfileHeadLeft}>
            {(props.match.params.id === 'me' || props.match.params.id === user.id) ?
              ''
            :  
              <FollowAddIcon 
                  follow={follow} 
                  isLoading={isLoading} 
                  setIsLoading={setIsLoading}
                  user={user}
                  setFollow={setFollow}
                  match={props.match} 
                />
              }
            </div>
          <div className={classes.userProfileHeadTitle}>{ user.username.charAt(user.username.length-1).toLowerCase() === "s"  ? `${user.username}' Mage Page` : `${user.username}'s Mage Page`}</div>
          <div className={classes.userProfileHeadRight}><SearchBar setSearch={setSearch}/></div>
        </div>

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
