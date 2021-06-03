import React, { useState, useEffect } from 'react'
import useStyles from '../../styles.js';
import SpellsApiService from '../../Services/spells-api-service';
import FollowCard from '../FollowCard'
import Pagination from '@material-ui/lab/Pagination';

function Follows() {
  const classes = useStyles();
  const [follows, setFollows] = useState()
  const [error, setError] = useState(null);
  const [changed, setChanged] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(3)
  useEffect(() => {
    let isMounted = true

    SpellsApiService.getFollows('me',currentPage)
      .then(follows => {
        if (isMounted) {
          setFollows(follows.follows)
        }
      })
      .catch(res => {
        setError(res.error);
      })
    return () => {
      isMounted = false
    }
  }, [changed])

  const deleteFollow = (user, following) => {
    SpellsApiService.deleteFollows(user, following)
    .then(res => {
      setChanged(true)
      setChanged(false)
    })
  }

  return(
    <>
      {follows && follows.map(follow => (
        <FollowCard follow={follow} deleteFollow={deleteFollow} key={'Key ', follow.id}/>
      ))}
      {follows && <div className={classes.followRoot}>
        <Pagination count={Math.ceil(follows.length / rowsPerPage)} /> 
      </div>}
    </>
  )
}



export default Follows;