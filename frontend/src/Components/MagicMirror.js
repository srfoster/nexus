import React, { useState, useEffect } from 'react';
import ConnectionIndicator from './Client/ConnectionIndicator.js';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import { CastButton } from './WorldWidgets/Util.js';


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
