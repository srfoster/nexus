import React, { useRef, useEffect, useState } from 'react';
import { CastButton } from './Util';
import ConnectionIndicator from '../Client/ConnectionIndicator';

function CloseUIButton(props) {
    return (
        <ConnectionIndicator afterConnection={
            <CastButton code={"(close-ui)"}>Close UI</CastButton>
        }></ConnectionIndicator>
    )
}

export default CloseUIButton;