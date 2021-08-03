import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

export function CastButton(props) {
    useEffect(() => {
        window.CodeSpellsSocket.onmessage = (e) => {
            try {
                console.log("Cast returned: ", JSON.parse(e.data))
            } catch (e) {

            }
        }
    },[])
    return <><Button
        onClick={() => {
            window.CodeSpellsSocket.send(props.code);
        }}
        variant="contained"
        color="secondary">
        { props.children || "Cast" }
        </Button></>
}
