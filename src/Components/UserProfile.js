import React, { useEffect, useState } from 'react';
import TokenService from '../Services/token-service';
import config from '../config';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';
import { makeStyles } from '@material-ui/core/styles';

const UserProfile = (props) => {
  const classes = useStyles();
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const { id } = props.match.params

    SpellsApiService.getUserById(id)
      .then(user => {
        setUser(user)
      })
  },[])

  return (
    user ?
      <>
        <Title>{`Spellbook of ${user.username}`}</Title>
        <Spellbook spells={user.spells}/>
      </>
    : ''
  );
};

const useStyles = makeStyles((theme) => ({
name: {
  textAlign: "left",
}

}));

export default UserProfile;
