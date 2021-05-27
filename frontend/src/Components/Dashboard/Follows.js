import React, { useState, useEffect } from 'react'
import SpellsApiService from '../../Services/spells-api-service';
import FollowCard from '../FollowCard'

function Follows() {
  const [follows, setFollows] = useState()
  const [error, setError] = useState(null);
  useEffect(() => {
    let isMounted = true

    SpellsApiService.getFollows('me')
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
  }, [])

  return(
    <>
      {follows && follows.map(follow => (
        <FollowCard follow={follow} key={'Key ', follow.id}/>
      ))}
    </>
  )
}



export default Follows;