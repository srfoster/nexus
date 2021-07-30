import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

export function CastButton(props) {
    return <><Button
        onClick={() => {
            window.CodeSpellsSocket.send(props.code);
        }}
        variant="contained"
        color="secondary">
        { props.children || "Cast" }
        </Button></>
}
