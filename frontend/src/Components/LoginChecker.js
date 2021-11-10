import React, { useRef, useEffect, useState } from 'react';
import { LoggedInContext } from './Context';
import SpellsApiService from "../Services/spells-api-service";

export default function LoginChecker(props) {
  const [loginInfo, setLoginInfo] = useState({ loggedIn: false });
  const [lastLoginTime, setLastLoginTime] = useState(undefined)

  useEffect(() => {
    let isMounted = true;
    // Only running this to check if logged in
    let promise_or_false = SpellsApiService.getUserById('me');

    if (promise_or_false) {
      promise_or_false
        .then((user) => { if (isMounted) { setLoginInfo({ loggedIn: true, user: user }) } })
        .catch(() => { if (isMounted) { setLoginInfo({ loggedIn: false }) } })
    }
    return () => {
      isMounted = false
    }
  }, [lastLoginTime])

  return (
    <LoggedInContext.Provider value={[loginInfo, setLastLoginTime]}>
      {props.children}
    </LoggedInContext.Provider>)
}