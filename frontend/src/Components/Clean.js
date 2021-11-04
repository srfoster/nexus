import { DocModalWithButton } from "./Widgets/Docs";
import { Button, Card, CardContent, CardHeader, Container, Slider, Typography } from '@material-ui/core';
import React, { useRef, useEffect, useState } from 'react';
import { JSMirror } from "./Widgets/Educational";
import { UIScope } from "./WorldWidgets/UIScope";
import Draggable from 'react-draggable';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { ZoomContext } from './Context';

export default function Clean (props){
  //This is here b/c otherwise Unreal sizes the UI too large when it first loads... not sure why
  const [load, setLoad] = useState(false);
  const [size, setSize] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 1000)
    document.body.style.setProperty("background-color", "transparent", "important");
  }, [])

  function increaseZoom(event){
    if(size<2){
      setSize(size + 0.1);
    }
  }
  
  function decreaseZoom(event){
    if(size>0.5){
      setSize(size - 0.1);
    }
  }
    
  return (<>
    <Draggable
      handle=".main-handle"
    //bounds="parent"
    //grid={[25, 25]} 
    >
      <div>
        <ZoomContext.Provider value={[size, setSize]}>
          <Container style={{ float: "left", padding: 5, zoom: size }} maxWidth="sm">
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
                      <Button onClick={decreaseZoom}><RemoveIcon /></Button>
                      <Button onClick={increaseZoom}><AddIcon /></Button>
                    </>
                  }>
                </CardHeader>
                <CardContent>
                  {load ?
                    <JSMirror code={"<DocModalWithButton/>"} scope={UIScope} name="main" /> :
                    <></>}
                </CardContent>
              </Card>
            </div>
          </Container>
        </ZoomContext.Provider>
      </div>
    </Draggable>
  </>)
}