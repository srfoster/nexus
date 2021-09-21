import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

//These seem simple now, but we should isolate them here in case things become more complicated.  The more this file and web-ui.rkt are the only files involved in the React/Racket interface, the better.  Protect our newborn abstractions and give them room to grow!!!
export const isError = (x) => {
  return x.response && x.response.error
}

export const racketErrorMessage = (x) => {
  return x.response.error
}

export const racketErrorBlockId = (x) => {
  return x.response.blockId
}

export const racketErrorLineNumber = (x) => {
  return x.response.lineNumber
}

export const sendOnCodeSpellsSocket = (code, cb) => {
    let s = new WebSocket("ws://localhost:8082/test");
    s.onmessage = function (event) {
        console.log("This is a Racket Bridge Event: ", event)
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
  return (
    <Button
      color={props.color}
      variant={props.variant}
      onClick={() => {
        sendOnCodeSpellsSocket(props.code, (data) => {
          props.onReturn(data)
        });
      }}>
      {props.children || "Cast Spell"}
    </Button>
  )
}
