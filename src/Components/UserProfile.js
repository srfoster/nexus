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
        console.log(user);
        setUser(user)
      })

  },[])

  return (
    user ?
    <React.Fragment>
      <Title>{`Spellbook of ${user.username}`}</Title>
      {/* <p className={classes.name}>Username: {user.username}</p>
      <p className={classes.name}>Spells created: {user.spells.length}</p>
      <p className={classes.name}>User since: {new Date(Date.parse(user.date_created)).toLocaleDateString()}</p> */}
      {/* <p className={classes.name}>Users public spells:
        
      </p> */}
      <Spellbook spells={user.spells}/>

    </React.Fragment>
    : ''
  );
};

const useStyles = makeStyles((theme) => ({
name: {
  textAlign: "left",
}

}));

export default UserProfile;
