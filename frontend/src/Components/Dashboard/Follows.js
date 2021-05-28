import React, { useState, useEffect } from 'react'
import SpellsApiService from '../../Services/spells-api-service';
import FollowCard from '../FollowCard'

function Follows() {
  const [follows, setFollows] = useState()
  const [error, setError] = useState(null);
  const [changed, setChanged] = useState(false)
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
    </>
  )
}



export default Follows;