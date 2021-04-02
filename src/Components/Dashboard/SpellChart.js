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
import {useSpellContext} from '../Context';
import SpellsApiService from '../../Services/spells-api-service';
import {textTrim} from '../../Util.js'
import Pagination from '@material-ui/lab/Pagination';
import TablePagination from '@material-ui/core/TablePagination';
import TableContainer from '@material-ui/core/TableContainer';
import Checkbox from '@material-ui/core/Checkbox';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';

export default function SpellChart(props) {

  const classes = useStyles();
  let history = useHistory();

  const [open, setOpen] = React.useState(false);
  const [spellToDelete, setSpellToDelete] = React.useState(undefined);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = (id) => {
    // setOpen(true);
    setSpellToDelete(id);
  };

  const handleClose = (id) => {
    // setOpen(false);
    setSpellToDelete(undefined);
  };

  const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    title: {
      flex: '1 1 100%',
    },
  }));

  const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    
  }

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClickRow = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSpellSelected = (id) => selected.indexOf(id) !== -1;

  const rows = props.spells.length;

  function byNameAndModified( a, b ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }

    if (a.date_modified > b.date_modified){
      return -1;
    }
    if (a.date_modified < b.date_modified){
      return 1;
    }
    return 0;
  }

  function deleteSpell(id){
    SpellsApiService.deleteSpell(id)
      .then(() => props.onDelete(id))
  }

  const updateSpell = (spell) => {
    console.log(spell)
    let payload = spell
    // console.log(payload);

    SpellsApiService.updateSpell(payload, spell.id)
      .then((spell) => {
        // props.setSpells({...spell, is_public: !spell.is_public})
        props.onChange(spell)
      })
  }

  function addIcon(event) {
    if (props.spells){
      SpellsApiService.postNewSpell()
        .then(spell => {
          props.setSpells([...props.spells, spell])
        })
    }
  }

  function deleteAllSelected() {
    SpellsApiService.deleteSpell(selected)
      .then(res => {
        // Re-request current page of spells
        props.setRefresh(Math.random())
        setSelected([])
      })
  }

  return (
    props.spells ?
    <React.Fragment>
      <Title>My Spells
        {/* <Tooltip title="Delete" className={classes.icons}>
          <IconButton aria-label="delete">
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip> */}
      </Title>

      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: selected.length > 0,
        })}
      >
        {selected.length > 0 ? (
          <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
            {selected.length} selected
          </Typography>
        ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Nutrition
          </Typography>
        )}

        {selected.length > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteForeverIcon 
                onClick={deleteAllSelected}
              />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>


      <TableContainer className={classes.container}>
      <Table size="small" padding="none" stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                // checked={isItemSelected}
                // inputProps={{ 'aria-labelledby': labelId }}
              />
            </TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Modified</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Code</TableCell>
            <TableCell className={classes.icons} >Edit</TableCell>
            {/*<TableCell className={classes.icons}>Delete</TableCell>*/}
            <TableCell className={classes.icons}>Public</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {/*rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).*/}
          {props.spells.map((spell) => (
            <TableRow 
              key={"Key: " + spell.id}
              onClick={(event) => handleClickRow(event, spell.id)}
            >
            <TableCell padding="checkbox">
              <Checkbox
                checked={isSpellSelected(spell.id)}
                // inputProps={{ 'aria-labelledby': labelId }}
              />
            </TableCell>
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
              {/*<TableCell className={classes.icons}>
                <IconButton aria-label="delete"
                  onClick={() => handleClickOpen(spell.id)}
                  // onClick={handleClickOpen}
                >
                  <DeleteForeverIcon />
                </IconButton>

                {/* Dialog confirmation */}{/*
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
              */}
              <TableCell className={classes.icons}>
                <IconButton id={spell.id} aria-label="isPublic" onClick={() => {
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
      </TableContainer>
      {/*FIXME: Need endpoint to only supply displayed rows*/}
      {/*<Title>
        <div className={classes.root}>
          <TablePagination
          rowsPerPageOptions={[10, 20, 40]}
          component="div"
          count={props.totalSpells} //change to spells.spells?
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </Title>*/}


      <Title>
          <div className={classes.root}>
            <Pagination count={Math.ceil(props.totalSpells / rowsPerPage)}
            onChange={(event ,page ) => {props.setCurrentPage(page)}}
            //function(event: object, page: number) => void
            //event: The event source of the callback.
            //page: The page selected.
            />
          </div>
      </Title>
    </React.Fragment>
    : ''
  );
}


const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  delIcon: {
    display: 'inline-flex',
    align: 'right',
  },
  icons: {
    align: 'right',
    textAlign: 'center',
    width: '5%'
  },
  header: {
    stickyHeader: true,
  },
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
      display: 'flex',
    justifyContent: 'center',
    },
  },
  container: {
    maxHeight: '70vh',
  },
}));
