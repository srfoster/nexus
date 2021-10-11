import React, { useState, useEffect } from 'react';
import { spread } from '../Util.js';
import ConnectionIndicator from './Client/ConnectionIndicator.js';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import { CastButton, isError, racketErrorMessage, racketErrorBlockNumber, racketErrorLineNumber } from './WorldWidgets/Util.js';
import { Alert, AlertTitle } from '@material-ui/lab';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button'
import { UIScope } from './WorldWidgets/UIScope.js';

export function MagicMirror(props) {
    const [code, setCode] = useState(props.code);
    const [response, setResponse] = useState(undefined);
    const [error, setError] = useState(false);
    const [errorLineNumber, setErrorLineNumber] = useState(false);

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
        {!error ? "" :
            <Alert severity="error">{
                !errorLineNumber ? "" : <>Error on line {errorLineNumber}<br /></>
            }{error}</Alert>}
        {response === undefined ? "" :
            <Alert severity="success"><pre><code>{response}</code></pre></Alert>}
        <CastButton color="secondary" variant="contained" code={code} onReturn={(fromUnreal) => {
            if (isError(fromUnreal)) {
                setError(racketErrorMessage(fromUnreal))
                setErrorLineNumber(racketErrorLineNumber(fromUnreal))
                setResponse(undefined)
            } else {
                setError(false)
                setErrorLineNumber(false)
                if(fromUnreal.response && fromUnreal.response.customReactComponent){
                    let CustomComponent = UIScope[fromUnreal.response.customReactComponent]
                    setResponse(<CustomComponent data={fromUnreal.response}/>)
                }
                else{
                    setResponse(fromUnreal.racketResponse)
                }
            }
            props.onReturn && props.onReturn(fromUnreal)
        }} />
        &nbsp;
        {props.additionalButtons}
        <ConnectionIndicator afterConnection="" />
    </>
}
