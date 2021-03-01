import React from 'react';
import { useHistory } from "react-router-dom";
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TokenService from '../../Services/token-service';
import config from '../../config';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function SpellChart(props) {
  const classes = useStyles();
  let history = useHistory();

  const [open, setOpen] = React.useState(false);
  const [spellToDelete, setSpellToDelete] = React.useState(undefined);

  const handleClickOpen = (id) => {
    // setOpen(true);
    setSpellToDelete(id);
  };

  const handleClose = (id) => {
    // setOpen(false);
    setSpellToDelete(undefined);
  };

  function byName( a, b ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }

  function textTrim(text, length){
    if (!text) return '';
    
    if(text.length > length){
      return text.slice(0, length) + '...';
    } else { 
      return text;
    }
  }

  function deleteSpell(id){
    // console.log("Clicked delete", id);
    

    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      // body: JSON.stringify(payload)
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
      .then(() => props.onDelete(id))
  }

  return (
    <React.Fragment>
      <Title>My Spells</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Created</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Code</TableCell>
            <TableCell align="right">Edit</TableCell>
            <TableCell align="right">Delete</TableCell>
            <TableCell align="right">Public</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.spells.sort(byName).map((spell) => (
            <TableRow key={"Key: " + spell.id}>
              <TableCell>{new Date(Date.parse(spell.date_created)).toLocaleDateString()}</TableCell>
              <TableCell>{textTrim(spell.name, 15)}</TableCell>
              <TableCell>{textTrim(spell.description, 30)}</TableCell>
              <TableCell>{textTrim(spell.text, 65)}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="edit" onClick={() => history.push(`/spells/${spell.id}`)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell align="right">
                <IconButton aria-label="edit" 
                  onClick={() => handleClickOpen(spell.id)}
                  // onClick={handleClickOpen}
                >
                  <DeleteForeverIcon />
                </IconButton>

                {/* Dialog confirmation */}
                <Dialog
                  // open={open}
                  open={spellToDelete === spell.id}
                  onClose={() => handleClose(spell.id)}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Delete spell?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you would like to delete this spell?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => {handleClose(); deleteSpell(spell.id)}} color="secondary">
                      Delete
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                      Keep
                    </Button>
                  </DialogActions>
                </Dialog>

              </TableCell>
              <TableCell align="right">
                <Icon aria-label="edit">
                  {spell.is_public ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </Icon>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));