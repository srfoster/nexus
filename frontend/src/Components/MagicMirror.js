import React, { useState, useEffect, useContext } from 'react';
import { spread, useLocalStorage } from '../Util.js';
import ConnectionIndicator from './Client/ConnectionIndicator.js';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import { CastButton, isError, racketErrorMessage, racketErrorBlockNumber, racketErrorLineNumber } from './WorldWidgets/Util.js';
import { Alert, AlertTitle } from '@material-ui/lab';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button'
import { UIScope } from './WorldWidgets/UIScope.js';
import { FontSizeContext } from './Context.js';
import { LoggedInContext } from './Context.js';


//   const [isLoggedIn, setIsLoggedIn] = useState(undefined);

//   useEffect(() => {
//     let isMounted = true;
//     // Only running this to check if logged in
//     let promise_or_false = SpellsApiService.getUserById('me');

//     if (promise_or_false) {
//       promise_or_false
//         .then((user) => {if(isMounted) {setIsLoggedIn(true)}})
//         .catch(() =>    {if(isMounted) {setIsLoggedIn(false)}})
//     }
//     return () => {
//       isMounted = false
//     }
//   })


    // e.preventDefault()
// 
    // AuthApiService.postLogin({
    //   username: usernameInput.current.value,
    //   password: passwordInput.current.value,
    // })
    //   .then(user => {
        // usernameInput.current.value = ''
        // passwordInput.current.value = ''
        // props.onLoginSuccess()
        // handleLoginSuccess()
    //   })
    //   .catch(res => {
        // setError(res.error);
    //   })



export function MagicMirror(props) {
    const [code, setCode] = useLocalStorage((props.name || Math.random())+ "-magic-mirror-code", props.code) //useState(props.code);
    const [response, setResponse] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [output, setOutput] = useState(undefined);
    const [errorLineNumber, setErrorLineNumber] = useState(false);
    const [size, setSize] = useContext(FontSizeContext);
    const [loginInfo, _] = useContext(LoggedInContext);
    const [editor, setEditor] = useState(undefined);

    //if (props.code && code != props.code) //Override localstorage if we pass in some code
     //   setCode(props.code)

    const [starterCode, setStarterCode] = useState();
    useEffect(()=>{
        setStarterCode(props.code || code)
    },[props.code])

    useEffect(()=>{
        editor && editor.refresh();
        console.log(editor) 
    },[size])

    const backupToCloud = (code) => {
        //service API call to create or update spell with tagname (name)
        //send a PUT request to /spells/USERNAME/SPELL-NAME
        //don't send blank spells
        //debounce
    }

    const includes = () => {
        if (!props.includes) return ""
        
        let ret = ""

        for (let i of props.includes)
            ret += JSON.parse(localStorage.getItem(i+"-magic-mirror-code"))

        return ret
    }

    return <>
        {loginInfo.loggedIn ? <p>Logged In as {JSON.stringify(loginInfo.user)}</p> : <p>Not logged in</p>}
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
                backupToCloud(value);
                if (props.onChange) {
                    props.onChange(editor, data, value);
                }
            }}
            editorDidMount={(e)=>{
                setEditor(e)
            }}
        />
        {!error ? "" :
            <Alert severity="error" style={{ overflowX: "auto" }}>
                {!errorLineNumber ? "" : <>Error on line {errorLineNumber}<br /></>}
                <pre><code>{error}</code></pre>
            </Alert>}
        {response === undefined ? "" :
            <Alert severity="success" style={{ overflowX: "auto" }}><pre><code>{response}</code></pre></Alert>}
        {output === undefined ? "" :
            <Alert severity="warning" style={{ overflowX: "auto" }}><pre><code>{output}</code></pre></Alert>}
        {props.hideButtons ? "" :
            <>
                <CastButton color="secondary" variant="contained" code={includes()+code}
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
                <ConnectionIndicator afterConnection="" /></>}
    </>
}
