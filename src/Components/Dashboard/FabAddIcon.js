import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import SpellsApiService from '../../Services/spells-api-service';
import { useHistory } from "react-router-dom";

function FabAddIcon(props) {
  const classes = useStyles();
  let history = useHistory();

  // function createSpell(event) {
  //   if (props.spells){
  //     SpellsApiService.postNewSpell()
  //       .then(spell => {
  //         props.setSpells([...props.spells, spell])
  //       })
  //   }
  // }

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

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
}));

export default FabAddIcon;