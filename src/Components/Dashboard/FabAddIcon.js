import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import SpellsApiService from '../../Services/spells-api-service';
import { useHistory } from "react-router-dom";
import useStyles from '../../styles.js';

function FabAddIcon(props) {
  const classes = useStyles();
  let history = useHistory();

  const clickNewSpell = () => {
    SpellsApiService.postNewSpell()
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