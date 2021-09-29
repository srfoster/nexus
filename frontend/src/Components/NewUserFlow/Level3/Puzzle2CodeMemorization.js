
import React, { useRef, useEffect, useState } from 'react';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { useLocalStorage, spread } from "../../../Util";
import { SockPuppetChip, FakeTeacherChip, StudentChip, NewMessageNotification, PleaseWaitWhileSockPuppetCreatesContent, OpenedMessage, DidYouKnowCard } from '../../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';
import ChatBubble from '../../Widgets/ChatBubble/';
import { MagicMirror } from '../../MagicMirror';
import CloseUIButton from '../../WorldWidgets/CloseUIButton';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CardHeader from "@material-ui/core/CardHeader";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { sendOnCodeSpellsSocket } from '../../WorldWidgets/Util';
import Markdown from 'markdown-to-jsx';

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



const useStyles = makeStyles((theme) => ({
  card: {
    flexGrow: 1,
    marginRight: "0px"//240
  },
  toolbar: theme.mixins.toolbar
}));

function DocDefinition(props){
  const classes = useStyles();
  const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

  return(
        <div key={props.data.name}>
          <Card className={classes.card} id={props.data.name} elevation={4} style={{borderRadius:"5px"}}>
            {/* <CardHeader align="left" subheader={} /> */}
            <CardContent>
          <code><pre style={{marginTop: 0, marginBottom: 10}}>{props.data.use}</pre></code>
              <TableContainer style={{borderRadius:"5px"}}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        parameter
                      </StyledTableCell>
                      <StyledTableCell align="center">type</StyledTableCell>
                      <StyledTableCell align="center">optional</StyledTableCell>
                      <StyledTableCell align="center">
                        description
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.data.parameter.map((param) => (
                      <TableRow>
                        <StyledTableCell align="center">
                          {param}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <code>{props.data.type[props.data.parameter.indexOf(param)]}</code>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {props.data.optional[props.data.parameter.indexOf(param)] ? (
                            <CheckIcon />
                          ) : (
                            <ClearIcon />
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {props.data.parameterDesc[props.data.parameter.indexOf(param)]}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <br />
              <Typography align="left">
                Returns: <code>{props.data.returns ? props.data.returns : "void?"}</code>
              </Typography>
              <br />
              <Markdown>{props.data.desc}</Markdown>
              <br />
              {props.data.example.map((codeExample) => (
                <div style={{paddingTop: 20}}>
               <MagicMirror code={codeExample} additionalButtons={[]} /> 
              </div>
              ))}
            </CardContent>
          </Card>
          <br />
        </div>
  )
}

function DocModal(props){
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');
  const [definitionList, setDefinitionList] = useState([])

  useEffect(()=>{
    sendOnCodeSpellsSocket("(get-docs)",
      (res)=>setDefinitionList(res.response))
  },[])

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <div>
        <Button onClick={handleClickOpen('paper')}>Docs</Button>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll='paper'
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Docs</DialogTitle>
          <DialogContent dividers={true}>
            <DialogContentText
              id="scroll-dialog-description"
              tabIndex={-1}>
              {definitionList.map(e=><DocDefinition data={e}/>)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
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