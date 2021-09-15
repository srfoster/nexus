import React, { useRef, useEffect, useState } from 'react';
import { CastButton } from './Util';
import ConnectionIndicator from '../Client/ConnectionIndicator';

function CloseUIButton(props) {
    return (
            <CastButton
                color="secondary" variant="contained"
                onReturn={(d) => { console.log("UI closed",d) }}
                code={"(close-ui)"}>Enter World</CastButton>
            )
}

export default CloseUIButton;