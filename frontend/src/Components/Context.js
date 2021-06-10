import React, { useEffect, useState } from 'react';
import { ThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";


export const DarkModeContext = React.createContext();{

}

/*
import TokenService from '../Services/token-service';
import config from '../config';
import { useHistory } from "react-router-dom";
import SpellsApiService from '../Services/spells-api-service';

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
    SpellsApiService.getSpellsByUser()
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
*/