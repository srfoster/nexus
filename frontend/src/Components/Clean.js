import { DocModalWithButton } from "./Widgets/Docs";
import { Button, Card, CardContent, CardHeader, Container, Slider, Typography } from '@material-ui/core';
import React, { useRef, useEffect, useState } from 'react';
import { JSMirror } from "./Widgets/Educational";
import { UIScope } from "./WorldWidgets/UIScope";
import Draggable from 'react-draggable';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { FontSizeContext } from './Context';
import { AccountCreationReminder } from './NewUserFlow/Level' 

export default function Clean (props){
  //This is here b/c otherwise Unreal sizes the UI too large when it first loads... not sure why
  const [load, setLoad] = useState(false);
  const [size, setSize] = useState(16);

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 1000)
    document.body.style.setProperty("background-color", "transparent", "important");
  }, [])

  useEffect(() => {
    document.body.style.fontSize = size + "pt";
  }, [size])

  function increaseFontSize(event){
    if(size<30){
      setSize(size + 2);
    }
  }
  
  function decreaseFontSize(event){
    if(size>8){
      setSize(size - 2);
    }
  }
    
  return (<>
    <Draggable
      handle=".main-handle"
    //bounds="parent"
    //grid={[25, 25]} 
    >
      <div>
        <FontSizeContext.Provider value={[size, setSize]}>
          <Container style={{ float: "left", padding: 5 }} maxWidth="sm">
            <div style={{ padding: 10 }}>
              <Card>
                <CardHeader
                  avatar={
                    <>
                      <strong className="main-handle" style={{ cursor: "pointer" }}>
                        <OpenWithIcon />
                      </strong>
                    </>}
                  action={
                    <>
                      <Button onClick={decreaseFontSize}><RemoveIcon /></Button>
                      <Button onClick={increaseFontSize}><AddIcon /></Button>
                    </>
                  }>
                </CardHeader>
                <CardContent>
                  {load ?
                    <JSMirror code={"<DocModalWithButton/>"} scope={UIScope} name="main" /> :
                    <></>}
                </CardContent>
                <AccountCreationReminder doNotRedirect/>
              </Card>
            </div>
          </Container>
        </FontSizeContext.Provider>
      </div>
    </Draggable>
  </>)
}