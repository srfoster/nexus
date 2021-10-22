import React, { useRef, useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Container, Typography } from '@material-ui/core';

export default function Lesson (props){
  let LessonContent;
  try{
    LessonContent = require("./" + props.name).default;
  }
  catch(e){
    LessonContent = () => "Lesson not found.";
  }

  return (<>
    <LessonContent />
  </>)
}