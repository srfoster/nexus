import React, { useRef, useEffect, useState } from 'react';
import { MagicMirror } from '../MagicMirror';
import CloseUIButton from '../WorldWidgets/CloseUIButton';
import Draggable from 'react-draggable';
import 'react-resizable/css/styles.css';
import { CardActions } from '@material-ui/core';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import { sendOnCodeSpellsSocket } from '../WorldWidgets/Util';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

const {Resizable} = require('react-resizable');

function Room(props){
  const [width, setWidth] = useState(props.data.width)
  const [height, setHeight] = useState(props.data.height)
  const [x, setX] = useState(props.data.x)
  const [y, setY] = useState(props.data.y)
  const [contextMenuTarget, setContextMenuTarget] = useState(null);

  const onResize = (event, {element, size, handle}) => {
    setWidth(size.width)
    setHeight(size.height)
    props.onRoomChange(props.data.name, {width: size.width, height: size.height, x, y})
  }


  const onDrag = (event, {x, y}) => {
    setX(x)
    setY(y)
    props.onRoomChange(props.data.name, {width, height, x, y})
  }

  const handleClose = (e) => {
    setContextMenuTarget(null);
  }

  const deleteRoom = () => {
    props.onRoomDelete(props.data.name)
  }

  return (
    <><Menu
      id="simple-menu"
      anchorEl={contextMenuTarget}
      keepMounted
      open={Boolean(contextMenuTarget)}
      onClose={handleClose}
    >
      <MenuItem onClick={deleteRoom}>Delete</MenuItem>
    </Menu>
      <Draggable handle="strong" bounds="parent"
        onDrag={onDrag}
        grid={[25, 25]} >
        <Resizable width={width} height={height} onResize={onResize} resizeHandles={['se']} draggableOpts={{ grid: [25, 25] }}>
          <div 
          onContextMenu={(e)=>{
            e.preventDefault()
            setContextMenuTarget(e.target)
          }}
          style={{
            margin: 0,
            padding: 0,
            position: 'absolute',
            width: width,
            height: height,
            opacity: 0.5,
            backgroundColor: props.color,
            border: "1px solid white",
            cursor: "pointer",
            display: "inline-block"
          }}>
            <strong style={{ cursor: "pointer" }}><OpenWithIcon /></strong>
            {props.children}</div>
        </Resizable>
      </Draggable></>
  )
}

function Door(props){
  const [x, setX] = useState(props.data.x)
  const [y, setY] = useState(props.data.y)
  const [contextMenuTarget, setContextMenuTarget] = useState(null);

  const onDrag = (event, {x, y}) => {
    setX(x)
    setY(y)
    props.onDoorChange(props.data.name, {x, y})
  }

  const handleClose = (e) => {
    setContextMenuTarget(null);
  }

  const deleteDoor = () => {
    props.onDoorDelete(props.data.name)
  }


  return (
    <><Menu
      id="simple-menu"
      anchorEl={contextMenuTarget}
      keepMounted
      open={Boolean(contextMenuTarget)}
      onClose={handleClose}
    >
      <MenuItem onClick={deleteDoor}>Delete</MenuItem>
    </Menu>
      <Draggable handle="strong" bounds="parent"
        onDrag={onDrag}
        grid={[5, 5]} >
        <div
          onContextMenu={(e) => {
            e.preventDefault()
            setContextMenuTarget(e.target)
          }}
          style={{
            margin: 0,
            padding: 0,
            position: 'absolute',
            opacity: 0.5,
            width: 26,
            height: 26,
            backgroundColor: props.color,
            border: "1px solid white",
            cursor: "pointer",
            display: "inline-block"
          }}>
          <strong style={{ cursor: "pointer" }}><OpenWithIcon /></strong>
          {props.children}</div>
      </Draggable></>
  )
}

export default function RoomUI(props){
  const [compilingTimeout, setCompilingTimeout] = useState(false)
  const [rooms, setRooms] = useState([])
  const [doors, setDoors] = useState([])
  const [compiledCode, setCompiledCode] = useState("")

  useEffect(compile, [rooms, doors])

  function onRoomChange(name, data){
    data.name = name
    let newRooms = rooms.map((r)=>r.name==name? data : r )
    setRooms(newRooms)
  }
 
  function onRoomDelete(name){
    setRooms(rooms.filter(e=>e.name != name))
  }
 
  function onDoorDelete(name){
    setDoors(doors.filter(e=>e.name != name))
  }

  function onDoorChange(name, data){
    data.name = name
    let newDoors = doors.map((r)=>r.name==name? data : r )
    setDoors(newDoors)
  }

  function addRoom(){
    let room = {
      name: "room" + Math.random(),
      width:75,
      height:75,
      x: 0,
      y: 0
    }    
    setRooms(rooms.concat([room]));
  }

  function addDoor() {
    let door = {
      name: "door" + Math.random(),
      x: 0,
      y: 0
    }
    setDoors(doors.concat([door]))
  }

  function compile() {
    let roomCode = rooms.map(e=>`(translate (vec ${Math.floor((e.x + e.width/2) / 10) * 200} ${Math.floor((e.y + e.height/2)/10) * 200} 0) (room ${Math.floor(e.width/10) * 200} ${Math.floor(e.height/10) * 200} 1000))`)
    let doorCode = doors.map(e=>`(translate (vec ${Math.floor((e.x + 26/2) / 10) * 200} ${Math.floor((e.y + 26/2)/10) * 200} 0) (sphere ${Math.floor(26/2/10) * 200} 'air))`)

    let compiledCode = props.wrapper === false ? 
    "(format-racket-code \"(overlay \n" +
              roomCode.join("\n") +
              doorCode.join("\n") +
              ")\")" : 
              "(format-racket-code \"(build (overlay \n" +
              roomCode.join("\n") +
              doorCode.join("\n") +
              "))\")"

    if (!compilingTimeout) {
      setCompilingTimeout(
        setTimeout(
          () => {
            sendOnCodeSpellsSocket(compiledCode,
              (res) => {
                setCompiledCode(res.response)
                props.onCompile && (typeof props.onCompile === "function") && props.onCompile(res.response)
                setCompilingTimeout(false)
              })
          }, 500)
      )
    }
  }

  function clearRooms(){
    setRooms([])
    setDoors([])
  }

  return (
    <>
  <Card style={{ }}>
    <CardActions>
      <Button onClick={addRoom}>New Room</Button>
      <Button onClick={addDoor}>New Door</Button>
      <Button onClick={clearRooms}>Clear</Button>
    </CardActions>
      <CardContent>
        <div className="box" style={{ height: '300px', width: '100%', position: 'relative', overflow: 'auto', padding: '10' }}>
          {rooms.map((e) => <Room color="gray" key={e.name} data={e} onRoomChange={onRoomChange} onRoomDelete={onRoomDelete}></Room>)}
          {doors.map((e) => <Door color="red" key={e.name} data={e} onDoorChange={onDoorChange} onDoorDelete={onDoorDelete}></Door>)}
      </div>
    </CardContent>
  </Card>
      { compilingTimeout ? "Compiling ..." :
      <MagicMirror code={ compiledCode }
      additionalButtons={<CloseUIButton/>}/> }
    </>
  )
}