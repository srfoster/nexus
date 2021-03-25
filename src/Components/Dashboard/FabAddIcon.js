import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import SpellsApiService from '../../Services/spells-api-service';

function FabAddIcon(props) {
  const classes = useStyles();

  // function createSpell(event) {
  //   if (props.spells){
  //     SpellsApiService.postNewSpell()
  //       .then(spell => {
  //         props.setSpells([...props.spells, spell])
  //       })
  //   }
  // }

  return (
    <Tooltip title="New Spell" placement="top">
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={props.clickIcon}>
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