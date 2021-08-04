import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import Chip from '@material-ui/core/Chip';
import { sendOnCodeSpellsSocket } from '../WorldWidgets/Util.js';

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
        sendOnCodeSpellsSocket("(hash 'hello \"world\")", (payload) => {
            if(payload.response.hello == "world")
              setConnected(true)
        })
    },[])

    return <>
        {connected ? <Connected afterConnection={props.afterConnection} /> : <NotConnected />}
    </>
};

export default ConnectionIndicator;