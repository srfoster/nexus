import React, { useState, useEffect } from 'react';

const ConnectionIndicator = (props) => {
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        var s = new WebSocket("ws://localhost:8082/test");
        s.onmessage = function (event) {
            if (!connected)
                setConnected(true)
        }
        s.open = function (event) {
            console.log("Open...");
        }
        window.CodeSpellsSocket = s;
    },[])

    return (
    <>
            {connected ? <><p>Connected</p>{props.afterConnection}</> : "Not Connected"}
    </>
  )
};

export default ConnectionIndicator;