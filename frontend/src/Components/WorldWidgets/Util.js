import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

export function SpellThreadManager(props){
  let threadId = props.data.threadId
  return(
    <>
      <CastButton code={"(kill-spell-thread " + threadId + ")"}>Stop This Spell</CastButton>
      <CastButton code={"(kill-all-spell-threads)"}>Stop All Spells</CastButton>
    </>
  )
}

let subscribedEvents = {} 

function subscribeToUnrealEvent(eventType, cb) {
  if (subscribedEvents[eventType])
    subscribedEvents[eventType].push(cb)
  else
    subscribedEvents[eventType] = [cb];
  return cb
}

function unsubscribeFromUnrealEvent(eventType, cb){
  if(subscribedEvents[eventType]){
    subscribedEvents[eventType] = subscribedEvents[eventType].filter((f)=>f!=cb)
  }
}

let pastEvents = {
  "projectile-hit": [],
  "zone-enter": [],
}

subscribeToUnrealEvent("projectile-hit",(data)=>{
  pastEvents["projectile-hit"].unshift(data)
})

subscribeToUnrealEvent("zone-enter",(data)=>{
  pastEvents["zone-enter"].unshift(data)
})

export function EventLogger(props){
  const [refreshToken, setRefreshToken] = useState(0)

  const type = props.type || "projectile-hit"
  const [validEvent, setValidEvent] = useState(pastEvents[type] !== undefined)


  //useEffect gets called everytime user types in JS Mirror!
  useEffect(()=>{
    let subscriptionID = subscribeToUnrealEvent(type, 
      (data) => {
        setRefreshToken(Math.random())  
      })
      return ()=>{
        console.log("Cleaning up event logger...")
        unsubscribeFromUnrealEvent(type, subscriptionID)}
  }, [])

  return (!validEvent ? ("Not a valid event.  Must be one of: " + Object.keys(pastEvents)) :
    <>
      <p>{pastEvents[type].length == 0 ? "No "+type+" events yet" : "Events ("+type+"):"}</p>
      <ul>
        {(props.lastEventOnly && pastEvents[type][0] ? [pastEvents[type][0]] : pastEvents[type]).map((e, i) => {
          return props.component ? <props.component key={i} data={e}></props.component> : <li key={i}>
            <code><pre>{e.racketResponse}</pre></code>
          </li>
        })}
      </ul>
    </>
  )
} 

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

let codeSpellsWebSocket;
let settingUpWebSocket = false;
export const getWebSocket = (afterSetup) => {
  if (codeSpellsWebSocket) return afterSetup(codeSpellsWebSocket)

  if (settingUpWebSocket) {
    console.log("No websocket, but there should be one soon! Waiting...")
    setTimeout(()=>{getWebSocket(afterSetup)}, 3000)
  }
  else {
    settingUpWebSocket = true

    let s = new WebSocket("ws://localhost:8082/test");

    s.onmessage = function (event) {
      console.log("This is a Racket Bridge Event: ", event)
      let data = JSON.parse(event.data)
      let eventType = data.eventType
      let cbs = subscribedEvents[eventType]
      cbs && cbs.map((cb) => {
        cb(data)
      })
      if ((typeof eventType) == "number") {
        delete subscribedEvents[eventType]
      }
    }
    let i = setInterval(() => {
      console.log("Trying to connect")
      if (s.readyState == 1) {
        console.log("Sending")
        clearInterval(i)
        codeSpellsWebSocket = s;
        return afterSetup(s)
      }
    }, 1000);
  }
}

export const prettifyRacketCode = (code, cb) => {
  sendOnCodeSpellsSocket(`(format-racket-code ${JSON.stringify(code)} )`,
    (res) => {
      if(isError(res)){
        return code
      }
      else
        return cb(res.response)
    })
}

export const sendOnCodeSpellsSocket = (code, cb) => {
  console.log("Sending")
  let eventType = Math.random()
  if(cb) subscribedEvents[eventType] = [cb]
  getWebSocket((s)=>{s.send(JSON.stringify({ code: code, eventType: eventType }))})
}

export function CastButton(props) {
  return (
    <Button
      color={props.color}
      variant={props.variant}
      onClick={() => {
        sendOnCodeSpellsSocket(props.code, (data) => {
          props.onReturn && props.onReturn(data)
        });
      }}>
      {props.children || "Cast Spell"}
    </Button>
  )
}
