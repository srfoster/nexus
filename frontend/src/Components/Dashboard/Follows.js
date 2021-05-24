import React, { useState, useEffect } from 'react'
import SpellsApiService from '../../Services/spells-api-service';

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
      <div>Adding friends stuff now</div>
      {follows && follows.map(follow => {
        return <p>user: {follow.user_id} follows: {follow.follower_id}</p>
      })}
    </>
  )
}


export default Follows;