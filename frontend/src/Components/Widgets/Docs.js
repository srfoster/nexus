import React, { useRef, useEffect, useState } from 'react';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { CastButton, EventLogger, sendOnCodeSpellsSocket } from '../WorldWidgets/Util';
import Markdown from 'markdown-to-jsx';
import { AppBar, Badge, Card, ButtonGroup, CardActions, CardContent, CardHeader, Chip, CircularProgress, Paper, Radio, RadioGroup, Slider, Tab } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { MagicMirror } from '../MagicMirror';
import { BlocklyIDE, JSMirror } from './Educational';
import { useLocalStorage } from '../../Util';
import { DidYouKnowCard, PleaseWaitWhileSockPuppetCreatesContent } from './NexusVoice';
import SimpleVideoPlayer from './SimpleVideoPlayer';
import ChatBubble from './ChatBubble';
import { Alert } from '@material-ui/lab';
import RoomUI from '../WorldWidgets/RoomUI';
import BlueBalls from './BlueBalls';
import { Game } from './react-gameoflife/Game';
import NetworkDiseaseSimulator from './NetworkDiseaseSimulator';
import { defineRacketBlock, defineStatementRacketBlock } from '../Dashboard/customBlocks/custom_Blocks';

const useStyles = makeStyles((theme) => ({
  card: {
    flexGrow: 1,
    marginRight: "0px"//240
  },
  toolbar: theme.mixins.toolbar
}));

function UIFunctionDefExample(props) {
  const [code, setCode] = useLocalStorage(props.name + "-example-code", props.code);

  return (
    <>
      {code != props.code ? <Button onClick={() => { setCode(props.code) }}>Revert</Button> : ""}
      <JSMirror code={code}
        scope={UIExampleScope}
        onChange={(code) => {
          setCode(code)
          return true
        }} />
    </>
  )
}

function UIFunctionDef(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card} id={props.name} elevation={4} style={{ borderRadius: "5px" }}>
      <CardHeader style={{ backgroundColor: "#222222", color: "white" }} title={props.name}>
      </CardHeader>
      <CardContent>
        {props.examples.map((example, i) => <UIFunctionDefExample key={props.name+i} name={props.name+i} code={example}/>)}
      </CardContent>
    </Card>
  )
}

function DocUILibrarySection(props){
  const [accordionExpanded, setAccordionExpanded] = useLocalStorage(props.name+"-ui-accordion", false)

  return(
      <Accordion key={props.name}
        expanded={accordionExpanded}
        onChange={(event,newValue) => setAccordionExpanded(!accordionExpanded)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          {props.name}
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: "100%" }}>
            {props.functionDefs.map(def=>{return <UIFunctionDef name={def.name} examples={def.examples}/>})}
          </div>
        </AccordionDetails>
      </Accordion>
  )
}

function DocUILibrary(props) {

  return (
    <>
      <DocUILibrarySection name="Base" functionDefs={[
        {
          name: "BlocklyIDE",
          examples: [`<BlocklyIDE height={400} blockIds={[]} />`,`<BlocklyIDE height={400} blockIds={[  
          {
            blockName: "build",
            inputs: ["builder"],
            output: false,
            doParens: true,
            doBlockName: true,
            color: 230
          },
          {
            blockName: "sphere",
            inputs: ["radius #"],
            output: true,
            doParens: true,
            doBlockName: true,
            color: 230
          } ,
          {
            blockName: "#",
            takesUserInput: true,
            inputs: [""],
            output: "#",
            doParens: false,
            doBlockName: false,
            color: 80
          }
        ]}
        />
          `]
        },
        {
          name: "NetworkDiseaseSimulator",
          examples: [`<NetworkDiseaseSimulator nodes={["Socks", "Shoes", "Feet"]} edges={[["Feet", "Socks"], ["Socks","Shoes"]]} patientZero="Feet" />`]
        },
        {
          name: "BallPitToy",
          examples: [`<BallPitToy />`]

        },
        {
          name: "GameOfLife",
          examples: [`<GameOfLife color={"purple"} />`, `(props)=> {
  const [cells, setCells] = React.useState([])
  
  return <>
    <p>Number of active cells: {cells.length}</p>
    <GameOfLife color={"purple"} setCells={setCells}/>
  </>}`, 
  `(props)=> {
  const [cells, setCells] = React.useState([])
  
  return <>
    <GameOfLife color={"purple"} setCells={setCells}/>
    <MagicMirror code={\`(build
 (overlay
  \${cells.map((c)=> \`(translate (vec 0 \${c.x * 500} \${-c.y * 500}) (sphere 250))\`).join("\\n")}
  ))\`} />    
  </>}`]
        },
        {
          name: "EventLogger",
          examples: [`<EventLogger 
  component={(props)=>{
    return <CastButton code={"(build (sphere 1000) " + props.data.racketResponse + ")"}></CastButton>
  }}></EventLogger>`]
        },
        {
          name: "CastButton",
          examples: [`<CastButton code={"(close-ui)"}/>`, `<CastButton code={"(build (sphere 1000))"}>Build Sphere</CastButton>`]
        },
        {
          name: "MagicMirror",
          examples: [`<MagicMirror code={"(close-ui)"}/>`, `<MagicMirror code={"(build (sphere 500))"}/>`]
        },
        {
          name: "JSMirror",
          examples: [`<JSMirror code={'<ChatBubble>You can change this code to whatever you want!</ChatBubble>'} />`,
          `(props)=>{
  const [start, setStart] = React.useState(false)
  
  return start? 
  <>
    <p>This JSMirror creates another JSMirror that creates another JSMirror that creates a Button! How meta!</p>
    <JSMirror 
      code={\`<JSMirror code={"<JSMirror code={'<ChatBubble>You can change me in 3 places!</ChatBubble>'} />"}/>\`}/>
  </> : 
  <Button onClick={()=>{setStart(true)}}>
    Ready to get your mind blown?
  </Button>}`]
        },
        {
          name: "SimpleVideoPlayer",
          examples: [`<SimpleVideoPlayer videoUrl={"https://codespells-org.s3.amazonaws.com/NexusVideos/e-2.5-smaller.ogv"} />`,
            `(props)=>{
const [x, setX] = React.useState(false)

return !x ? <SimpleVideoPlayer videoUrl={"https://codespells-org.s3.amazonaws.com/NexusVideos/e-2.5-smaller.ogv"} setVideoFinished={()=>setX(true)} /> : <CastButton code={"(build (sphere 1000))"}>Cast!</CastButton>}`
          ]
        },
        {
          name: "DidYouKnowCard",
          examples: [`<DidYouKnowCard>... That you're awesome?</DidYouKnowCard>`]
        },
        {
          name: "PleaseWaitWhileSockPuppetCreatesContent",
          examples: [`(props)=>{
  const [completed, setCompleted] = React.useState(false)
  const [started, setStarted] = React.useState(false)
  
  let stallingMessages = [<ChatBubble>Hello!</ChatBubble>, <ChatBubble>Socks!</ChatBubble>]
  
  let waitForSockPuppet = <PleaseWaitWhileSockPuppetCreatesContent 
    setContentComplete={()=>{setCompleted(true)}} 
    contentComplete={completed} 
    SockPuppetMessage={<h1>Hello!</h1>} 
    NexusStallingMessages={stallingMessages} />
  
  return !started ? 
  <Button 
    onClick={()=>setStarted(true)}
    >Start</Button> : 
  waitForSockPuppet
}`]
        },
        {
          name: "RoomUI",
          examples: [`<RoomUI/>`]
        }
      ]} />
      
      <DocUILibrarySection name="Meta" functionDefs={[
        {
          name: "DocModalWithButton",
          examples: [`<DocModalWithButton/>`]
        },
        {          
          name: "DocContent",
          examples: [`<DocContent/>`]
        },
      ]} />
    </>
  )
}

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
            <CardHeader style={{backgroundColor: "#222222", color: "white"}} title={props.data.name}>
            </CardHeader>
            <CardContent>
          <code><pre style={{ marginTop: 0, marginBottom: 10 }}>{props.data.use}</pre></code>
              {props.data.parameter.length > 0? <TableContainer style={{borderRadius:"5px"}}>
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
                      <TableRow key={param}>
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
              </TableContainer> : <Typography align="left">This function does not take any parameters.</Typography>}
              <br />
              <Typography gutterBottom={true} align="left">
                Return Type: <code>{props.data.returns ? props.data.returns : "void?"}</code>
              </Typography>
              <Typography><Markdown>{props.data.desc}</Markdown></Typography>
              {props.data.example.map((codeExample) => (
                <div key={codeExample} style={{paddingTop: 20}}>
                  <MagicMirror code={codeExample} additionalButtons={[]} /> 
              </div>
              ))}
            </CardContent>
          </Card>
          <br />
        </div>
  )
}

const DocLibrary = (props) => {
  const definitionCategories = props.definitionCategories

  return (
    definitionCategories.map(category => {
      let defs = category.definitions
      return (
        <Accordion key={category.name}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            {category.name}
          </AccordionSummary>
          <AccordionDetails>
            <div style={{width: "100%"}}>
              { defs.map(def => <DocDefinition key={def.name} data={def} />) }
            </div>
          </AccordionDetails>
        </Accordion>
      )
    })
  )
}

export function DocModalWithButton(props) {
  const [open, setOpen] = useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (

    <>
      <Button onClick={handleClickOpen}>Docs</Button>
      <DocModal open={open} setOpen={setOpen}/>
    </>
  )
}

export function DocContent(props) {
  const [value, setValue] = useState(0);
  const [baseDefinitionCategories, setBaseDefinitionCategories] = useState([])
  const [voxelDefinitionCategories, setVoxelDefinitionCategories] = useState([])
  const [characterDefinitionCategories, setCharacterDefinitionCategories] = useState([])

  const docArray = [<DocLibrary key="base" definitionCategories={baseDefinitionCategories} />,
  <DocLibrary key="voxel" definitionCategories={voxelDefinitionCategories} />,
  <DocLibrary key="character" definitionCategories={characterDefinitionCategories} />,
  <DocUILibrary key="ui" />
  ];

  const handleTabChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    sendOnCodeSpellsSocket("(get-base-api-docs)",
      (res) => {
        setBaseDefinitionCategories(res.response)
      })
  }, [])

  useEffect(() => {
    sendOnCodeSpellsSocket("(get-voxel-api-docs)",
      (res) => {
        setVoxelDefinitionCategories(res.response)
      })
  }, [])

  useEffect(() => {
    sendOnCodeSpellsSocket("(get-character-api-docs)",
      (res) => {
        setCharacterDefinitionCategories(res.response)
      })
  }, [])

  return (
    <>
      <Tabs value={value} onChange={handleTabChange} >
        <Tab label={"Base"}></Tab>
        <Tab label={"Voxel"}></Tab>
        <Tab label={"Character"}></Tab>
        <Tab label={"User Interface"}></Tab>
      </Tabs>
      {docArray[value]}
    </>
  )
}

export function DocModal(props){
  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <div>
      <Dialog
        disableEnforceFocus
        open={props.open}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Docs</DialogTitle>
        <DialogContent dividers={true}>
          <DocContent />
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

export let UIExampleScope = {
  JSMirror: (props)=>{return <JSMirror code={props.code} onChange={props.onChange} scope={UIExampleScope}/>},
  EventLogger,
  MagicMirror,
  RoomUI,
  BallPitToy: BlueBalls,
  GameOfLife: Game,
  BlocklyIDE,
  defineStatementRacketBlock,
  defineRacketBlock,
  NetworkDiseaseSimulator,
  CastButton,
  DocModalWithButton,
  DocContent,
  DidYouKnowCard,
  SimpleVideoPlayer,
  PleaseWaitWhileSockPuppetCreatesContent,
  ChatBubble,
  Button,
  Badge, AppBar, Badge, Card, ButtonGroup, 
  CardActions, CardContent, CardHeader, Chip, 
  CircularProgress, Paper, Radio, RadioGroup, Slider,
}
