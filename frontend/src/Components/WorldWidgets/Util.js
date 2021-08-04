import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';


export const sendOnCodeSpellsSocket = (code, cb) => {
    let s = new WebSocket("ws://localhost:8082/test");
    s.onmessage = function (event) {
        cb(JSON.parse(event.data))
    }
    let i = setInterval(() => {
        if (s.readyState == 1) {
            s.send(code)
            clearInterval(i)
        }
    }, 100);
}

export function CastButton(props) {
    return <><Button
        onClick={() => {
            sendOnCodeSpellsSocket(props.code, (data) => {
                props.onReturn(data)
            });
        }} 
        variant="contained"
        color="secondary">
        { props.children || "Cast" }
        </Button></>
}
