import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Spellcard from './Spellcard';

const Spellbook = (props) => {
  const classes = useStyles();
// console.log(props.spells)

  const [cardImage, setCardImage] = useState(undefined);

  const [spellId, setSpellId] = useState(undefined);

  // useEffect(() => {
  //   setCardImage("https://source.unsplash.com/random")
  // }, [])

  return (
    <Container className={classes.cardGrid} maxWidth="md">
      <Grid container spacing={4}>
        {props.spells.map((spell) => (
          <>
          {/* {setCardImage(cardImage)} */}
          <Spellcard cardImage={cardImage} spell={spell} key={spell.id}/>
          </>
        ))}
      </Grid>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

export default Spellbook;
