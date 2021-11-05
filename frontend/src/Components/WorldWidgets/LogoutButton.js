import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import TokenService from '../../Services/token-service';

export function LogoutButton(){
  function handleClick(e){
    TokenService.clearAuthToken();
    window.location.reload();
  }
  
  return(
    <Button onClick={handleClick}>Logout</Button>
  )  
}