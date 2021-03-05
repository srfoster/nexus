import React, { useEffect, useState } from 'react';
import TokenService from '../Services/token-service';
import config from '../config';
import Title from './Dashboard/Title';

// Make this page work for any user
// Inside the endpoint, look up how to do a join query and combine user and spells

const UserProfile = (props) => {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const { id } = props.match.params

    return fetch(`${config.API_ENDPOINT}/wizards/${id}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
      .then(user => {
        setUser(user)
      })

  },[])

  return (
    user ?
    <React.Fragment>
      <Title>My Profile</Title>
      <p>{user.username}</p>
      <p>{user.spells.length}</p>


    </React.Fragment>
    : ''
  );
};

export default UserProfile;