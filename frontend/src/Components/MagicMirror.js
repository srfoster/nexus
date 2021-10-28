import React, { useState, useEffect } from 'react';
import { spread, useLocalStorage } from '../Util.js';
import ConnectionIndicator from './Client/ConnectionIndicator.js';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import { CastButton, isError, racketErrorMessage, racketErrorBlockNumber, racketErrorLineNumber } from './WorldWidgets/Util.js';
import { Alert, AlertTitle } from '@material-ui/lab';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button'
import { UIScope } from './WorldWidgets/UIScope.js';

export function MagicMirror(props) {
    const [code, setCode] = useLocalStorage((props.name || Math.random())+ "-magic-mirror-code", props.code) //useState(props.code);
    const [response, setResponse] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [output, setOutput] = useState(undefined);
    const [errorLineNumber, setErrorLineNumber] = useState(false);

    //if (props.code && code != props.code) //Override localstorage if we pass in some code
     //   setCode(props.code)

    const [starterCode, setStarterCode] = useState();
    useEffect(()=>{
        setStarterCode(props.code || code)
    },[props.code])

    return <>
        <ReactCodeMirror
            value={
                starterCode || props.value
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
            <Alert severity="error" style={{overflowX: "auto"}}>
                {!errorLineNumber ? "" : <>Error on line {errorLineNumber}<br /></>}
                <pre><code>{error}</code></pre>
            </Alert>}
        {response === undefined ? "" :
            <Alert severity="success" style={{overflowX: "auto"}}><pre><code>{response}</code></pre></Alert>}
        {output === undefined ? "" :
            <Alert severity="warning" style={{overflowX: "auto"}}><pre><code>{output}</code></pre></Alert>} 
        
        <CastButton color="secondary" variant="contained" code={code} 
          onReturn={(fromUnreal) => {
            setError(undefined)
            setResponse(undefined)
            setOutput(undefined)

            if (isError(fromUnreal)) {
                setError(racketErrorMessage(fromUnreal))
                setErrorLineNumber(racketErrorLineNumber(fromUnreal))
            }
            if (fromUnreal.response && fromUnreal.response.customReactComponent) {
                let CustomComponent = UIScope[fromUnreal.response.customReactComponent]
                setResponse(<CustomComponent data={fromUnreal.response} />)
            }
            else {
                setResponse(fromUnreal.racketResponse)
            }

            if (fromUnreal.output) {
                setOutput(fromUnreal.output)
            }
            props.onReturn && props.onReturn(fromUnreal)
        }} />
        &nbsp;
        {props.additionalButtons}
        <ConnectionIndicator afterConnection="" />
    </>
}
