import React from 'react';
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

let useState = React.useState

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
    let selection = props.answers[Number(value)]
    if (selection) {
      setHelperText(selection.feedback);
      setError(!selection.correct);
      if (selection.correct) {
        props.onCorrect();
      } else {
        props.onIncorrect();
      }
    }
  }

  return (
    <>
      <Fade in={true} timeout={1000}>
        <>
          <FormControl component="fieldset" error={error}
            style={{ display: "flex", ...props.style }}>
            <FormLabel component="legend">{props.question}</FormLabel>
            <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
              {props.answers.map((e, i) => { return <FormControlLabel value={"" + i} control={<Radio />} label={e.text} /> })}
            </RadioGroup>
            <FormHelperText>{helperText}</FormHelperText>
          </FormControl>
          <Button size="small" onClick={handleSubmit} type="submit" variant="solid" color="primary">{props.buttonText}</Button>
        </>
      </Fade>
    </>
  );
}

export function JSMirror(props) {
  const [code,setCode] = useState(props.value) 

  return (
    <>
      <LiveProvider
        code={props.code} scope={props.scope} alignItems="center" justify="center">
        <LiveContext.Consumer>
          {({ code, language, theme, disabled, onChange }) => {
            return <Grid container spacing={1} direction={"column"} >
              <Grid item xs>
                <LiveEditor
                  onChange={(code) => {
                    setCode(code)
                    props.onChange(code)
                    onChange(code)
                  }
                  }
                />
              </Grid>
              <Grid item xs>
                <LiveError />
                <LivePreview />
              </Grid>
            </Grid>
          }}
        </LiveContext.Consumer>
      </LiveProvider>
    </>
  )
}