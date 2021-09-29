
import React, { useRef, useEffect, useState } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { useLocalStorage, spread } from "../../../Util";
import { SockPuppetChip, FakeTeacherChip, StudentChip, NewMessageNotification, PleaseWaitWhileSockPuppetCreatesContent, OpenedMessage, DidYouKnowCard } from '../../Widgets/NexusVoice';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChatBubble from '../../Widgets/ChatBubble';
import { MagicMirror } from '../../MagicMirror';
import CloseUIButton from '../../WorldWidgets/CloseUIButton';
import Alert from '@material-ui/lab/Alert';
import Draggable from 'react-draggable';
import 'react-resizable/css/styles.css';
import { CardActions } from '@material-ui/core';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import { overlayMode } from 'codemirror';
import { sendOnCodeSpellsSocket } from '../../WorldWidgets/Util';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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

  const onDrag = (event, {x, y}) => {
    setX(x)
    setY(y)
    props.onDoorChange(props.data.name, {x, y})
  }

  return (
    <Draggable handle="strong" bounds="parent"
      onDrag={onDrag}
      grid={[5, 5]} >
      <div style={{
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
    </Draggable>
  )
}

function RoomUI(props){
  const [rooms, setRooms] = useState([])
  const [doors, setDoors] = useState([])
  const [compiledCode, setCompiledCode] = useState("")

  function onRoomChange(name, data){
    data.name = name
    let newRooms = rooms.map((r)=>r.name==name? data : r )
    setRooms(newRooms)
    compile();
  }
 
  function onRoomDelete(name){
    setRooms(rooms.filter(e=>e.name != name))
    compile();
  }

  function onDoorChange(name, data){
    data.name = name
    let newDoors = doors.map((r)=>r.name==name? data : r )
    setDoors(newDoors)
    compile();
  }

  function addRoom(){
    let room = {
      name: "room" + rooms.length,
      width:75,
      height:75,
      x: 0,
      y: 0
    }    
    setRooms(rooms.concat([room]));
    compile();
  }

  function addDoor() {
    let door = {
      name: "door" + doors.length,
      x: 0,
      y: 0
    }
    setDoors(doors.concat([door]))
    compile();
  }

  function compile() {
    let roomCode = rooms.map(e=>`(translate (vec ${Math.floor((e.x + e.width/2) / 10) * 200} ${Math.floor((e.y + e.height/2)/10) * 200} 0) (room ${Math.floor(e.width/10) * 200} ${Math.floor(e.height/10) * 200} 1000))`)
    let doorCode = doors.map(e=>`(translate (vec ${Math.floor((e.x + 26/2) / 10) * 200} ${Math.floor((e.y + 26/2)/10) * 200} 0) (sphere ${Math.floor(26/2/10) * 200} 'air))`)
    
    sendOnCodeSpellsSocket("(format-racket-code \"(build (overlay \n" +
      roomCode.join("\n") +
      doorCode.join("\n") +
      "))\")",
      (res) => { 
        setCompiledCode(res.response)
      })
  }

  function clearRooms(){
    setRooms([])
    setDoors([])
  }

  return (
    <>
  <Card style={{ height: 500 }}>
    <CardActions>
      <Button onClick={addRoom}>New Room</Button>
      <Button onClick={addDoor}>New Door</Button>
      <Button onClick={clearRooms}>Clear</Button>
    </CardActions>
      <CardContent>
        <div className="box" style={{ height: '500px', width: '100%', position: 'relative', overflow: 'auto', padding: '10' }}>
          {rooms.map((e) => <Room color="gray" key={e.name} data={e} onRoomChange={onRoomChange} onRoomDelete={onRoomDelete}></Room>)}
          {doors.map((e) => <Door color="red" key={e.name} data={e} onDoorChange={onDoorChange}></Door>)}
      </div>
    </CardContent>
  </Card>
      <MagicMirror code={ compiledCode }
      additionalButtons={<CloseUIButton/>}/>
    </>
  )
}


function FadedExamplePuzzle(props){
    
}


const SockPuppetsMessage = (props) => {
  let [username, setUsername] = useLocalStorage("user-name", undefined);
  const [messageOpened, setMessageOpened] = useState(false)
  const openedMessage = useRef(null);

  useEffect(() => {
    if (openedMessage.current)
      { openedMessage.current.scrollIntoView() }
  },[messageOpened])

  return (!messageOpened ? <NewMessageNotification
    nexusSays={"Wow!  New messages(s)..."}
    from={<SockPuppetChip level={3}></SockPuppetChip>}
    onOpenClicked={
      () => {
        setMessageOpened(true)
      }
    }
  /> :
    <div ref={openedMessage}>
      <OpenedMessage
        from={<SockPuppetChip level={3} />}
        subject={"TBD"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e-3.1-smaller.ogv"
        text={
          <>
            <FadedExamplePuzzle/> 
          </>
        }
      />
    </div>
  )
}

function Page5(props){
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-3.5", false)

    return (<>
        <PleaseWaitWhileSockPuppetCreatesContent
            contentComplete={messageOpened}
            setContentComplete={setMessageOpened}
            NexusStallingMessages={
                [
                    <RoomUI/>,
                    <span><SockPuppetChip level={3} /> reminds you that you are still in his fork of the Nexus!</span>,
                    {
                        text: <ChatBubble><Typography>Write content.</Typography></ChatBubble>,
                        time: 4000
                    },
                ]
            }

            SockPuppetMessage={
                <SockPuppetsMessage setCanContinue={props.setCanContinue}></SockPuppetsMessage>
            }
        />

    </>)
}

export default Page5;