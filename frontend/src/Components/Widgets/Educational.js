import React, { useRef, useEffect, useState } from 'react';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
    LiveProvider,
    LiveEditor,
    LiveError,
    LivePreview,
    LiveContext
} from 'react-live'
import { spread, useLocalStorage } from '../../Util';
import { Card, CardContent, CardActions } from '@material-ui/core';
import { BlocklyWorkspace } from "react-blockly";
import { makeStyles } from '@material-ui/core/styles';
import Blockly from "blockly";
import { MagicMirror } from '../MagicMirror';
import CloseUIButton from '../WorldWidgets/CloseUIButton';
import { JSONtoRacketBlock } from '../Dashboard/customBlocks/custom_Blocks';
import { prettifyRacketCode } from '../WorldWidgets/Util';


export function Pages(props){
    const [currentSlide, setCurrentSlide] = useLocalStorage(props.name + "-current-page", 0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSlide])

    return (<>
                <Card elevation={4}>
                    <CardContent>
                        {props.children[currentSlide]}
                    </CardContent>
                    <CardActions>
                        {currentSlide == 0 ? "" : <Button key="back-button" color="secondary"
                            onClick={() => {
                                setCurrentSlide(currentSlide - 1);
                            }}>Back</Button>}
                        {currentSlide < props.children.length - 1 ?
                            <Button color="secondary" style={{ marginLeft: "auto" }}
                                key="continue-button" onClick={() => 
                                  {
                                    setCurrentSlide(currentSlide + 1)
                                  }}>
                                Next
                            </Button>
                            : ""}
                    </CardActions>
                </Card>
    </>)

}

export function BlocklyIDE(props) {
  const [blockIds, setBlockIds] = useState([]);
  const [code, setCode] = useState(undefined);

  const useStyles = makeStyles((theme) => ({
    blocklyPuzzle: {
      height: props.height || 200,
    },
  }))


  const classes = useStyles();

  useEffect(
    () => { if(props.blockIds) setBlockIds(props.blockIds.map(JSONtoRacketBlock))},
    [])

  return (!blockIds ? "" : <>
    <BlocklyWorkspace
      toolboxConfiguration={{
        kind: "categoryToolbox",
        contents: [
          {
            kind: "category",
            name: "Spells",
            colour: "#c1ba31",
            contents:
              blockIds.map((i) => {
                return { kind: "block", type: i }
              })
          },
        ],
      }
      }
      initialXml={'<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'}
      className={classes.blocklyPuzzle}
      workspaceConfiguration={{
        grid: {
          spacing: 20,
          length: 3,
          colour: "#ccc",
          snap: true,
        },
      }}
      onWorkspaceChange={(workspace) => {
        const precompile = Blockly.JavaScript.workspaceToCode(workspace);
        prettifyRacketCode(precompile, (code)=>setCode(code))
      }}
      onXmlChange={() => { }}
    />
    <MagicMirror
      code={code}
      options={{
        readOnly: false //"nocursor"
      }}
      additionalButtons={<CloseUIButton/>}
    />
  </>
  )
}

export function MultipleChoiceQuestion(props) {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState(' ');

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = () => {
    if (value == "") {
      props.onIncorrect && props.onIncorrect();
    } else {
      let selection = props.answers[Number(value)]
      if (selection) {
        setHelperText(selection.feedback);
        setError(!selection.correct);
        if (selection.correct) {
          props.onCorrect();
        } else {
          props.onIncorrect && props.onIncorrect();
        }
      }
    }
  }

  return (
    <>
      <Fade in={true} timeout={1000}>
        <>
          <FormControl component="fieldset" error={error}
            style={spread({ display: "flex" }, props.style)}>
            <FormLabel component="legend">{props.question}</FormLabel>
            <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
              {props.answers.map((e, i) => { return <FormControlLabel value={"" + i} key={"answer" + i} control={<Radio />} label={e.text} /> })}
            </RadioGroup>
            <FormHelperText component='span'>{helperText}</FormHelperText>
          </FormControl>
          <Button size="small" onClick={handleSubmit} type="submit" variant="contained" color="secondary">{props.buttonText}</Button>
        </>
      </Fade>
    </>
  );
}

export function JSMirror(props) {
  const [code, setCode] = useLocalStorage((props.name || Math.random()) +
    "-js-mirror-code", props.code)
  const [reverting, setReverting] = useState(false);

  const revertButton =
    <Button onClick={() => {
      window.localStorage.setItem(props.name + "-js-mirror-code", props.code)
      setCode(props.code)
      setReverting(true)
      setTimeout(() => { setReverting(false) }, 500)
    }}>
      Revert?
    </Button>
  
  return (
    <>
      {props.code != code ? revertButton : ""}
      <LiveProvider
        code={code} scope={props.scope} alignItems="center" justify="center">
        <LiveContext.Consumer>
          {({ code, language, theme, disabled, onChange }) => {
            return <Grid container spacing={1} direction={"column"} >
              <Grid item xs>
                {reverting ? "Reverting..." :
                  <LiveEditor
                    style={{ backgroundColor: "rgb(33,33,33)", borderRadius: "5px" }}
                    onChange={(code) => {
                      setCode(code)
                      props.onChange && props.onChange(code)
                      onChange(code)}}
                  />}
              </Grid>
              <Grid item xs>
                <Card elevation={4}>
                  {props.noEval ? "" :
                    <>
                      <CardContent>
                        <LiveError />
                        <LivePreview />
                      </CardContent>
                    </>}
                </Card>
              </Grid>
            </Grid>
          }}
        </LiveContext.Consumer>
      </LiveProvider>
    </>
  )
}