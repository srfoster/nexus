import React, { useRef, useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Container, Typography } from '@material-ui/core';
import { Pages } from '../Widgets/Educational';

export default function React1 (props){

  return (<>
       <Pages name="react-1">
         <Button>Hello!</Button>
         <Button>This is different!</Button>
       </Pages> 
  </>)
}