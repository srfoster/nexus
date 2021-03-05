import React, { useEffect, useState } from 'react';
import TokenService from '../Services/token-service';
import config from '../config';
import { useHistory } from "react-router-dom";

// Spells that will be needed:
// 1) User specific spells
// 2) Public spells


//Spells
const SpellContext = React.createContext({});

export function SpellContextProvider(props) {
  let history = useHistory();

  const [userSpells, setUserSpells] = useState([])
  const [publicSpells, setPublicSpells] = useState([])

  const [spells, setSpells] = useState([])
  
  useEffect(() => {
    // console.log(spells);
    // if(!TokenService.hasAuthToken()){history.push('/gallery')}
    return fetch(`${config.API_ENDPOINT}/spells`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => {
            // TODO: Check error message and act accordingly
            history.push('/gallery')
            // return Promise.reject(e)
          })
          : res.json()
      )
      .then(spells => setUserSpells(spells))
  }, [])
  
  return (
    <SpellContext.Provider value={{ userSpells }}>
      {props.children}
    </SpellContext.Provider>
  );
}

export const useSpellContext = () => React.useContext(SpellContext);


// Needed user data:
// Username

//User data
const UserContext = React.createContext({});

export function UserContextProvider(props) {
  let history = useHistory();

  const [user, setUser] = useState([])
  
  useEffect(() => {

  }, [])
  
  return (
    <UserContext.Provider value={{ user }}>
      {props.children}
    </UserContext.Provider>
  );
}

export const useContext = () => React.useContext(UserContext);