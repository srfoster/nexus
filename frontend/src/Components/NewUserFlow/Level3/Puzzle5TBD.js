
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

const {Resizable} = require('react-resizable');

function Room(props){
  const [width, setWidth] = useState(props.data.width)
  const [height, setHeight] = useState(props.data.height)
  const [x, setX] = useState(props.data.x)
  const [y, setY] = useState(props.data.y)

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

  return (
  <Draggable handle="strong" bounds="parent"
    onDrag={onDrag}
    grid={[25, 25]} >
    <Resizable width={width} height={height} onResize={onResize} resizeHandles={['se']} draggableOpts={{grid: [25, 25]}}>
      <div style={{
      margin: 0,
      padding: 0,
      position: 'absolute', 
      width: width,
      height: height,
      backgroundColor: props.color,
      border: "1px solid white",
      cursor: "pointer",
      display: "inline-block"
    }}>
      <strong style={{ cursor: "pointer" }}><OpenWithIcon/></strong>
      {props.children}</div>
    </Resizable>
  </Draggable>
  )
}

function RoomUI(props){
  const [rooms, setRooms] = useState([])

  function onRoomChange(name, data){
    console.log(data)
    data.name = name
    let newRooms = rooms.map((r)=>r.name==name? data : r )
    setRooms(newRooms)
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
  }

  return (
  <Card style={{ height: 500 }}>
    {JSON.stringify(rooms)}
    <CardActions>
      <Button onClick={addRoom}>New Room</Button>
    </CardActions>
      <CardContent>
        <div className="box" style={{ height: '500px', width: '100%', position: 'relative', overflow: 'auto', padding: '10' }}>
          {rooms.map((e) => <Room color="gray" key={e.name} data={e} onRoomChange={onRoomChange}></Room>)}
      </div>
    </CardContent>
  </Card>
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