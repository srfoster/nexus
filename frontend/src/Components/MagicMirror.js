import React, { useState, useEffect } from 'react';
import CodeMirror from 'codemirror';
import ConnectionIndicator from './Client/ConnectionIndicator.js';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import Button from '@material-ui/core/Button';

export function MagicMirror(props) {
    const [code, setCode] = useState(props.code);

    return <>
        <ReactCodeMirror
            value={
                props.code || props.value
            }
            options={props.options ||
        {
            lineWrapping: true,
            mode: 'scheme',
            theme: 'material',
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            styleActiveLine: true,
        }}
            onChange={(editor, data, value) => {
                setCode(value);
                if (props.onChange) {
                    props.onChange(editor, data, value);
                }
        }}
        />
        <ConnectionIndicator afterConnection={<CastButton code={code} />}></ConnectionIndicator>
    </>
}

export function CastButton(props) {
    return <><Button
        onClick={() => {
            window.CodeSpellsSocket.send(props.code);
        }}
        variant="contained"
        color="secondary">
            Cast
        </Button></>
}
