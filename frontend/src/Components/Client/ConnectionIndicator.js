import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import Chip from '@material-ui/core/Chip';

const tryToConnect = (onSuccess) => {
    let s = new WebSocket("ws://localhost:8082/test");
    s.onerror = function (event) {
        console.log("Websocket connection failed, retrying...", event)
        setTimeout(() => tryToConnect(onSuccess), 1000)
    }
    s.onmessage = function (event) {
        onSuccess()
    }
    s.open = function (event) {
        console.log("Open...");
    }
    window.CodeSpellsSocket = s;
}

const NotConnected = (props) => {
    return <>
        
        <Chip
            icon={<CircularProgress color="secondary" />}
            label={"Connecting"}/>
    </>
}


const Connected = (props) => {
    return <>
        <Chip
            icon={<CheckIcon />}
            label={"Connected!"}/>
        {props.afterConnection}
    </>
}

const ConnectionIndicator = (props) => {
    const [connected, setConnected] = useState(false)

    useEffect(() => {
      tryToConnect(()=>setConnected(true))
    },[])

    return <>
        {connected ? <Connected afterConnection={props.afterConnection} /> : <NotConnected />}
    </>
};

export default ConnectionIndicator;