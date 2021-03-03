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
import Tooltip from '@material-ui/core/Tooltip';

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

  const updateSpell = (spell) => {
    const { id } = spell

    let payload = spell
    console.log(payload);

    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(payload)
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
      .then((spell) => {
        // props.setSpells({...spell, is_public: !spell.is_public})
        props.onChange(spell)
      })
  }

  return (
    <React.Fragment>
      <Title>My Spells</Title>
      <Table size="small" padding="none">
        <TableHead>
          <TableRow>
            <TableCell>Created</TableCell>
            <TableCell>Modified</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Code</TableCell>
            <TableCell className={classes.icons} >Edit</TableCell>
            <TableCell className={classes.icons}>Delete</TableCell>
            <TableCell className={classes.icons}>Public</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.spells.sort(byName).map((spell) => (
            <TableRow key={"Key: " + spell.id}>
              <Tooltip title={new Date(Date.parse(spell.date_created)).toLocaleTimeString()} arrow placement="bottom-start">
                <TableCell>{new Date(Date.parse(spell.date_created)).toLocaleDateString()}</TableCell>
              </Tooltip>
              <Tooltip title={new Date(Date.parse(spell.date_modified)).toLocaleTimeString()} arrow placement="bottom-start">
                <TableCell>{new Date(Date.parse(spell.date_modified)).toLocaleDateString()}</TableCell>
              </Tooltip>
              <TableCell>{textTrim(spell.name, 15)}</TableCell>
              <TableCell>{textTrim(spell.description, 30)}</TableCell>
              <TableCell width='40%'>{textTrim(spell.text, 65)}</TableCell>
              <TableCell className={classes.icons}>
                <IconButton aria-label="edit" onClick={() => history.push(`/spells/${spell.id}`)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell className={classes.icons}>
                <IconButton aria-label="delete" 
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
              <TableCell className={classes.icons}>
                <IconButton aria-label="isPublic" onClick={() => {
                  // setSpell({...spell, is_public: !spell.is_public})
                  updateSpell({...spell, is_public: !spell.is_public})
                }}>
                  {spell.is_public ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
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
  icons: {
    align: 'right',
    textAlign: 'center',
    width: '5%'
  },
  header: {
    stickyHeader: true,
  }
}));