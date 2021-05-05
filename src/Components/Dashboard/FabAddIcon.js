import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import SpellsApiService from '../../Services/spells-api-service';
import { useHistory } from "react-router-dom";
import useStyles from '../../styles.js';
import Haikunator from 'haikunator';

function FabAddIcon(props) {
  const classes = useStyles();
  let history = useHistory();

  var haikunator = new Haikunator()


  const clickNewSpell = () => {
    let randomTitle = haikunator.haikunate({tokenLength: 0, delimiter: " "})
      .split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')

    console.log(randomTitle);
    
    SpellsApiService.postNewSpell(randomTitle)
    .then((spell) => {
      history.push(`/spells/${spell.id}`)
    })
  }

  return (
    <Tooltip title="New Spell" placement="top">
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => clickNewSpell()}>
        <AddIcon />
      </Fab>
    </Tooltip>
  );
}

export default FabAddIcon;