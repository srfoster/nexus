
import React, { useRef, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { useLocalStorage, spread } from "../../../Util";
import { SockPuppetChip, FakeTeacherChip, StudentChip, NewMessageNotification, PleaseWaitWhileSockPuppetCreatesContent, OpenedMessage, DidYouKnowCard } from '../../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';
import ChatBubble from '../../Widgets/ChatBubble/';
import { MagicMirror } from '../../MagicMirror';
import CloseUIButton from '../../WorldWidgets/CloseUIButton';
import Alert from '@material-ui/lab/Alert';
import DocModal from '../../Widgets/Docs';

function FadedExamplePuzzle(props){
    const answer = "(build-sphere (vec -484 1818 6166) 1000)"
    const [currentRound, setRound] = useState(0);
    const [code, setCode] = useState(answer);
    const [userAnswer, setUserAnswer] = useState(answer);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [numErrors, setNumErrors] = useState(0);
    const [completed, setCompleted] = useState(false)

    function underscores(length){
        let ret = ""
        for(let i = 0; i<length; i++){
            ret += "_"
        }
        return ret
    }

    function fadeCodeOne(code){
        //replace sequence that contains no parens, no spaces, and is not all underscores
        // with underscores
        let possibleIdentifiers = code.match(/([^() ]+)/g).map((e)=>e.replace(/[ ()]/g,""));
        //possibleIdentifiers.shift()
        let identifiers = possibleIdentifiers.filter((e)=>{return !e.match(/^_+$/)});
        let identifierToFade = identifiers[Math.floor(Math.random() * identifiers.length)]
        if(identifierToFade == undefined){
            return code
        }
        let reg = new RegExp(identifierToFade)
        let fadedCode = code.replace(reg, underscores(identifierToFade.length))
        return fadedCode
    }

    function fadeCode(code, identifiersToRemove){
        let fadedCode = code
        for(var i=0;i<identifiersToRemove; i++){
            fadedCode = fadeCodeOne(fadedCode)
        }
        return(fadedCode);
    }

    function restart(){
        setRound(0)
        setNumErrors(0)
        setErrorMessage(undefined)
        setCode("(build-sphere (vec -484 1818 6166) 1000)")
    }

    function complete(){
        setCompleted(true)
    }

    function nextRound(){
        if(userAnswer != answer) {
            setErrorMessage("Nope! It should be " + answer)
            setNumErrors(numErrors + 1)
        }
        else {
            setErrorMessage(undefined)
            setRound(currentRound + 1)
            let fadedCode = fadeCode(answer, (currentRound + 1) * 3)
            if(fadedCode == code){
                complete();
            }
            setCode(fadedCode)
        }
    }

    return(<>
        <Paper>
            <Button onClick={restart}>Restart</Button>
            <Button onClick={nextRound}>Next Round</Button>
            <p>Current Round: {currentRound}</p>
            <p>Total Errors: {numErrors}</p>
            { errorMessage ? <Alert severity="error">{errorMessage}</Alert> : ""} 
            { complete ? <Alert severity="success">Congrats! You did it!</Alert> : ""} 
            <MagicMirror
                code={code}
                onChange={(editor, data, value)=>setUserAnswer(value)}
                additionalButtons={<CloseUIButton />}
            />
                </Paper>
        </>);    
}


const SockPuppetsMessage = (props) => {
  let [username, setUsername] = useLocalStorage("user-name", undefined);
  const [messageOpened, setMessageOpened] = useState(false)
  const openedMessage = useRef(null);

  useEffect(() => {
    if (openedMessage.current)
      { openedMessage.current.scrollIntoView() }
  },[messageOpened])

  return (!messageOpened ? <NewMessageNotification
    nexusSays={"Wow!  New messages(s)..."}
    from={<SockPuppetChip level={3}></SockPuppetChip>}
    onOpenClicked={
      () => {
        setMessageOpened(true)
      }
    }
  /> :
    <div ref={openedMessage}>
      <OpenedMessage
        from={<SockPuppetChip level={3} />}
        subject={"TBD"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e-3.1-smaller.ogv"
        text={
          <>
            <FadedExamplePuzzle/> 
          </>
        }
      />
    </div>
  )
}




function Page2(props){
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-lesson-opened-3.2", false)

    return (<>
        <DocModal/>
        <PleaseWaitWhileSockPuppetCreatesContent
            contentComplete={messageOpened}
            setContentComplete={setMessageOpened}
            NexusStallingMessages={
                [
                    <span><SockPuppetChip level={3} /> reminds you that you are still in his fork of the Nexus!</span>,
                    {
                        text: <ChatBubble><Typography>Write content.</Typography></ChatBubble>,
                        time: 4000
                    },
                ]
            }

            SockPuppetMessage={
                <SockPuppetsMessage setCanContinue={props.setCanContinue}></SockPuppetsMessage>
            }
        />

    </>)
}

export default Page2;