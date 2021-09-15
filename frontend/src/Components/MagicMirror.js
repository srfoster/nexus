import React, { useState, useEffect } from 'react';
import { spread } from '../Util.js';
import ConnectionIndicator from './Client/ConnectionIndicator.js';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import { CastButton, isError, racketErrorMessage, racketErrorBlockNumber, racketErrorLineNumber } from './WorldWidgets/Util.js';
import { Alert, AlertTitle } from '@material-ui/lab';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button'

export function MagicMirror(props) {
    const [code, setCode] = useState(props.code);
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
                <CastButton color="secondary" variant="contained" code={code} onReturn={(fromUnreal) => {
                    if (isError(fromUnreal)) {
                        setError(racketErrorMessage(fromUnreal))
                        setErrorLineNumber(racketErrorLineNumber(fromUnreal))
                    } else {
                        setError(false)
                        setErrorLineNumber(false)
                    }
                    props.onReturn(fromUnreal)
                }} />
                &nbsp;
                {props.additionalButtons}
    </>
}
