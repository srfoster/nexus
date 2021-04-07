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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';

export default function SpellChart(props) {

  const classes = useStyles();
  let history = useHistory();

  const [open, setOpen] = React.useState(false);
  const [spellToDelete, setSpellToDelete] = React.useState(undefined);

  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [dense, setDense] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    // setSpellToDelete(id);
  };

  const handleClose = () => {
    setOpen(false);
    // setSpellToDelete(undefined);
  };

  const useToolbarStyles = makeStyles((theme) => ({
    // root: {
    //   paddingLeft: theme.spacing(2),
    //   paddingRight: theme.spacing(1),
    // },
    title: {
      flex: '1 1 100%',
    },
  }));

  const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    
  }

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event, id) => {
    if (event.target.checked) {
      console.log(selected)
      const newSelecteds = props.spells.map((n) => n.id);
      setSelected(newSelecteds);
      console.log(selected, 'too')
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

  const headCells = [
    { id: 'Created', numeric: false, disablePadding: true, label: 'Created' },
    { id: 'Modified', numeric: false, disablePadding: true, label: 'Modified' },
    { id: 'Name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'Description', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'Code', numeric: false, disablePadding: false, label: 'Code' },
    { id: 'edit', numeric: false, disablePadding: false, label: 'Edit'},
    { id: 'Public', numeric: false, disablePadding: false, label: 'Public'},
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = props.orderBy === property && props.order === 'asc';
    props.setOrder(isAsc ? 'desc' : 'asc');
    props.setOrderBy(property.toLowerCase());
  };

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    // rowsPerPage: PropTypes.number.isRequired,
  };

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

  function onSearchChange(event) {
    props.setSearch(event.target.value)
  }

  function SearchAppBar() {

    return (
      <>
        <div className={classes.searchIcon}>
        <SearchIcon />
        </div> 
        <div className={classes.searchBar}>
        <InputBase
          
          
          placeholder="Search Spells"
          onChange={onSearchChange}
          inputProps={{ 'aria-label': 'search' }}
        />
        </div>
      </>
    )
  }

  function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowsPerPage}
              checked={rowsPerPage > 0 && numSelected === rowsPerPage}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
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
           
      {SearchAppBar()}

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
          </Typography>
        )}

        {selected.length > 0 ? (
          <>
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={handleClickOpen}> 
              <DeleteForeverIcon 
                // onClick={deleteAllSelected}
              />
            </IconButton>
          </Tooltip>

            <Dialog 
              open={open}
              // open={spellToDelete === spell.id}
              onClose={() => handleClose()}
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
                <Button onClick={() => {handleClose(); deleteAllSelected()}} color="secondary">
                  Delete
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                  Keep
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          </Typography>
        )}
      </Toolbar>


      <TableContainer className={classes.container}>
      <Table size={dense ? 'small' : 'medium'} padding='none' stickyHeader aria-label="sticky table"> 
      <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={props.order}
              orderBy={props.orderBy}
              onSelectAllClick={(event) => handleSelectAllClick(event)}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
        {/* <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selected > 0 && selected < rowsPerPage}
                checked={rowsPerPage > 0 && selected === rowsPerPage}
                // onChange={onSelectAllClick}
                inputProps={{ 'aria-label': 'Select row of Spells' }}
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
            <TableCell className={classes.icons}>Public</TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {props.spells.map((spell) => (
            <TableRow 
              hover 
              key={"Key: " + spell.id}
              onClick={(event) => handleClickRow(event, spell.id)}
              selected={selected.indexOf(spell.id) !== -1}
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
                <IconButton 
                id={spell.id} 
                aria-label="isPublic" 
                onClick={(event) => {
                  // setSpell({...spell, is_public: !spell.is_public})
                  updateSpell({...spell, is_public: !spell.is_public});
                  event.stopPropagation();
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
          <div className={classes.pagi}>
            <Pagination count={Math.ceil(props.totalSpells / rowsPerPage)}
            onChange={(event ,page ) => {props.setCurrentPage(page)}}
            //function(event: object, page: number) => void
            //event: The event source of the callback.
            //page: The page selected.
            />

          </div>
      </Title>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
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
    padding: '0px'
  },
  icons: {
    align: 'right',
    textAlign: 'center',
  },
  header: {
    stickyHeader: true,
  },
  pagi: {
    '& > *': {
      marginTop: theme.spacing(1),
      display: 'flex',
      justifyContent: 'center',
    },
  },
  container: {
    maxHeight: '70vh',
  },
  searchIcon: {
    
    width: '24px'
  },
  searchBar: {
    height: '32px',
    width: '100px'
  },
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));
