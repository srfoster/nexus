import React, { useState, useEffect } from 'react';
import { spread } from '../Util.js';
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
            options={
                spread({
                    lineWrapping: true,
                    mode: 'scheme',
                    theme: 'material',
                    lineNumbers: true,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    styleActiveLine: true,
                }, props.options)
            }
            onChange={(editor, data, value) => {
                setCode(value);
                if (props.onChange) {
                    props.onChange(editor, data, value);
                }
        }}
        />
        <ConnectionIndicator afterConnection={<CastButton code={code} onReturn={ props.onReturn }/>}></ConnectionIndicator>
    </>
}
