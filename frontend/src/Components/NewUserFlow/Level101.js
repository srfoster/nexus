import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));


function Level101(props) {
  const [comboCorrect, setComboCorrect] = useState(false)
  const [guessed, setGuessed] = useState("")
  let correct = "123"

  function add(n) {
    setGuessed(guessed+n)
  }

  return (<Level number={101} subtitle={"Room 101, by Stephen R. Foster"}>
    <p>Welcome to Room 101</p>

    <p>Guess the combo...</p>
    <ButtonGroup size="small" aria-label="small outlined button group">
      <Button onClick={() => setGuessed("")}>Reset</Button>
      <Button onClick={() => add(1)}>1</Button>
      <Button onClick={() => add(2)}>2</Button>
      <Button onClick={() => add(3)}>3</Button>
    </ButtonGroup>
    {guessed !== correct ? "" :
      <ContinueButton
        onComplete={() => {
          props.setBadges(props.badges.concat([{ name: props.badgeName }]));
        }}
      ></ContinueButton>}
    <p>Current guess: { guessed }</p>
  </Level>)
}

export default Level101;