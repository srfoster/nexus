import React, { useEffect, useState } from 'react';
import TokenService from '../Services/token-service';
import config from '../config';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';

const UserProfile = (props) => {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const { id } = props.match.params

    SpellsApiService.getUserById(id)
      .then(user => {
        console.log(user);
        setUser(user)
      })

  },[])

  return (
    user ?
    <React.Fragment>
      <Title>My Profile</Title>
      <p>Username: {user.username}</p>
      <p>Spells created: {user.spells.length}</p>
      <p>User since: {new Date(Date.parse(user.date_created)).toLocaleDateString()}</p>
      <p>Users public spells: 
        <Spellbook spells={user.spells}/>
      </p>    

    </React.Fragment>
    : ''
  );
};

export default UserProfile;