import React, { useState, useEffect, useContext } from 'react'
import useStyles from '../../styles.js';
import SpellsApiService from '../../Services/spells-api-service';
import FollowCard from '../FollowCard'
import Pagination from '@material-ui/lab/Pagination';
import {SearchBar} from '../../Util.js'
import { DarkModeContext } from '../Context';

function Follows(props) {
  const classes = useStyles();
  const [follows, setFollows] = useState()
  const [error, setError] = useState(null);
  const [changed, setChanged] = useState(false)
  const [totalFollows, setTotalFollows] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [darkMode, setDarkMode] = useContext(DarkModeContext);
  
  useEffect(() => {
    let isMounted = true

    SpellsApiService.getFollows('me',currentPage)
      .then(follows => {
        if (isMounted) {
          setFollows(follows.follows)
          setTotalFollows(follows.total)
          console.log(follows)
        }
      })
      .catch(res => {
        setError(res.error);
      })
    return () => {
      isMounted = false
    }
  }, [currentPage, changed])

  const deleteFollow = (user, following) => {
    SpellsApiService.deleteFollows(user, following)
    .then(res => {
      setChanged(true)
      setChanged(false)
    })
  }
  return(
    <>
      <div className={darkMode ? classes.darkHeadBar : classes.headBar}>
        <div className={classes.headLeft}></div>
        <h4 className={classes.headTitle}>Mages you follow</h4>
        <div className={classes.headRight}></div>
      </div>
      {follows && follows.map(follow => (
        <FollowCard follow={follow} deleteFollow={deleteFollow} key={'Key ', follow.id}/>
      ))}
      {follows && <div className={classes.followRoot}>
        <Pagination count={Math.ceil(totalFollows / rowsPerPage)}
        onChange={(event, page) => {setCurrentPage(page)}}
         /> 
      </div>}
    </>
  )
}



export default Follows;