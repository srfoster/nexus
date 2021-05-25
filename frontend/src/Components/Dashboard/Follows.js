import React, { useState, useEffect } from 'react'
import SpellsApiService from '../../Services/spells-api-service';
import FollowCard from '../FollowCard'

function Follows() {
  const [follows, setFollows] = useState()
  const [error, setError] = useState(null);
  useEffect(() => {
    let isMounted = true

    SpellsApiService.getFollows()
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

  console.log(follows)

  return(
    <>
      <FollowCard>Adding friends stuff now</FollowCard>
      {follows && follows.map(follow => {
        return <p>user: {follow.user_id} follows: {follow.follower_id}</p>
      })}
    </>
  )
}


export default Follows;