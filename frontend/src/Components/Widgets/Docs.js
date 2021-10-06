import React, { useRef, useEffect, useState } from 'react';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
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
import { CastButton, EventLogger, sendOnCodeSpellsSocket } from '../WorldWidgets/Util';
import Markdown from 'markdown-to-jsx';
import { Tab } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { MagicMirror } from '../MagicMirror';
import { JSMirror } from './Educational';
import { useLocalStorage } from '../../Util';

const useStyles = makeStyles((theme) => ({
  card: {
    flexGrow: 1,
    marginRight: "0px"//240
  },
  toolbar: theme.mixins.toolbar
}));

function DocUILibrary(props) {
  const classes = useStyles();
  const [code, setCode] = useLocalStorage("test-js-mirror","");
  const [code2, setCode2] = useLocalStorage("test-js-mirror2","");
  const [baseAccordionExpanded, setBaseAccordionExpanded] = useLocalStorage("base-ui-accordion", false)

  return (
    <>
      <Accordion key="Base"
        expanded={baseAccordionExpanded}
        onChange={(event,newValue) => setBaseAccordionExpanded(!baseAccordionExpanded)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          Base
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: "100%" }}>
            <Card className={classes.card} id="Event Logger" elevation={4} style={{ borderRadius: "5px" }}>
              <CardHeader style={{ backgroundColor: "#222222", color: "white" }} title="Event Logger">
              </CardHeader>
              <CardContent>
                <JSMirror code={code}
                  scope={{
                    EventLogger: EventLogger,
                    CastButton: CastButton                        
                  }}
                  onChange={(code) => {
                    setCode(code)
                    return true
                  }} />
              </CardContent>
            </Card>
            <Card className={classes.card} id="CastButton" elevation={4} style={{ borderRadius: "5px" }}>
              <CardHeader style={{ backgroundColor: "#222222", color: "white" }} title="Cast Button">
              </CardHeader>
              <CardContent>
                <JSMirror code={code2}
                  scope={{
                    CastButton: CastButton                        
                  }}
                  onChange={(code2) => {
                    setCode2(code2)
                    return true
                  }} />
              </CardContent>
            </Card>
          </div>
        </AccordionDetails>
      </Accordion>
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

export function DocModal(props){
  const [value, setValue] = useState(0);
  const [baseDefinitionCategories, setBaseDefinitionCategories] = useState([])
  const [voxelDefinitionCategories, setVoxelDefinitionCategories] = useState([])
  const [characterDefinitionCategories, setCharacterDefinitionCategories] = useState([])
  
  const docArray = [<DocLibrary key="base" definitionCategories={baseDefinitionCategories}/>,
                    <DocLibrary key="voxel" definitionCategories={voxelDefinitionCategories} />,
                    <DocLibrary key="character" definitionCategories={characterDefinitionCategories} />,
                    <DocUILibrary key="ui"/>
                ];

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

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Docs</DialogTitle>
        <DialogContent dividers={true}>
          <Tabs value={value} onChange={handleTabChange} >
            <Tab label={"Base"}></Tab>
            <Tab label={"Voxel"}></Tab>
            <Tab label={"Character"}></Tab>
            <Tab label={"User Interface"}></Tab>
          </Tabs>
          { docArray[value] }
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