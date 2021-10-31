import { DocModalWithButton } from "./Widgets/Docs";
import { Button, Card, CardContent, CardHeader, Container, Typography } from '@material-ui/core';
import React, { useRef, useEffect, useState } from 'react';
import { JSMirror } from "./Widgets/Educational";
import { UIScope } from "./WorldWidgets/UIScope";
import Draggable from 'react-draggable';
import OpenWithIcon from '@material-ui/icons/OpenWith';

export default function Clean (props){
  //This is here b/c otherwise Unreal sizes the UI too large when it first loads... not sure why
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 1000)
    document.body.style.setProperty("background-color", "transparent", "important");
  }, [])
    
  return (<>
    <Draggable 
      handle=".main-handle" 
      //bounds="parent"
      //grid={[25, 25]} 
      >
      <Container style={{ float: "left", padding: 5 }} maxWidth="sm">
        <div style={{ padding: 10 }}>
          <Card>
            <CardHeader avatar={<strong className="main-handle" style={{ cursor: "pointer" }}><OpenWithIcon /></strong>}>
            </CardHeader>
            <CardContent>
              {load ?
                <JSMirror code={"<DocModalWithButton/>"} scope={UIScope} name="main" /> :
                <></>}
            </CardContent>
          </Card>
        </div>
      </Container>
    </Draggable>
  </>)
}