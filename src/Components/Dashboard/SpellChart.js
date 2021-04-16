import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import SpellsApiService from '../../Services/spells-api-service';
import {textTrim} from '../../Util.js'
import Pagination from '@material-ui/lab/Pagination';
import TableContainer from '@material-ui/core/TableContainer';
import Checkbox from '@material-ui/core/Checkbox';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Chip from '@material-ui/core/Chip';
import CodeIcon from '@material-ui/icons/Code';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import LockIcon from '@material-ui/icons/Lock';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import useStyles from '../../styles.js';
import { SpellChartHeader } from './SpellChartHeader.js';

export default function SpellChart(props) {

  const classes = useStyles();
  let history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [spellsPerPage, setSpellsPerPage] = React.useState(10);
  const [expanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [searchIcon, setSearchIcon] = React.useState(true)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popText, setPopText] = React.useState('Click To Copy')
  const isSpellSelected = (id) => selected.indexOf(id) !== -1;
  const popoverOpen = Boolean(anchorEl);
 
  const runSpell = (id) => {
    return "!!run " + id
  }

  const handleExpandClick = (id) => {
    setExpanded(id);
  };

  const handleClickOpen = () => {
    setOpen(true);
    // setSpellToDelete(id);
  };

  const handleClose = () => {
    setOpen(false);
    // setSpellToDelete(undefined);
  };

  const handleSearchIconClick = () => {
    setSearchIcon(!searchIcon);
  };

  const handleSelectAllClick = (event, id) => {
    if (event.target.checked) {
      const newSelecteds = props.spells
        .map((spell) => {
          return spell.id
        })
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClickRow = (event, spell) => {
    const name = spell.id
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

  const handleRequestSort = (event, property) => {
    const isAsc = props.orderBy.toLowerCase() === property.toLowerCase() && props.sortDirection === 'asc';
    props.setSortDirection(isAsc ? 'desc' : 'asc');
    props.setOrderBy(property.toLowerCase());
  };

  const updateSpell = (spell) => {
    let payload = spell

    SpellsApiService.updateSpell(payload, spell.id)
      .then((spell) => {
        props.onChange(spell)
      })
  }

  function deleteAllSelected() {
    SpellsApiService.deleteSpell(selected)
      .then(res => {
        // Re-request current page of spells
        props.setRefresh(Math.random())
        setSelected([])
      })
  }

  function onSearchIconChange(event) {
    props.setSearch(event.target.value)
  }
  
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopText('Click To Copy')
  }
  
  function SearchAppBar() {
    return (
      <>       
        <InputBase
          className={clsx(classes.searchField, searchIcon && classes.searchFieldHidden)}
          placeholder="Search Spells"
          onChange={onSearchIconChange}
          inputProps={{ 'aria-label': 'search' }}
        />
        <IconButton 
          onClick={(event) => handleSearchIconClick()}
        >
          <SearchIcon />
        </IconButton>
      </>
    )
  }

  return (
    props.spells ?
    <React.Fragment>

      <div className={classes.headBar}>
        <div className={classes.headLeft}></div>
        <div className={classes.headTitle}>My Spells</div>
        <div className={classes.headRight}>{SearchAppBar()}</div>
      </div>

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
        <Table size='small' padding='none' stickyHeader aria-label="sticky table"> 
          <SpellChartHeader
            classes={classes}
            numSelected={selected.length}
            sortDirection={props.sortDirection}
            orderBy={props.orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            spells={props.spells}
            spellsPerPage={spellsPerPage}
          />

          <TableBody>
            {props.spells.map((spell) => (
              <TableRow 
                hover 
                key={"Key: " + spell.id}
                onClick={(event) => handleClickRow(event, spell)}
                selected={selected.indexOf(spell.id) !== -1}
              >
                <TableCell padding="checkbox">
                  {spell.locked ?
                  ''
                  :
                  <Checkbox
                    checked={isSpellSelected(spell.id)}
                  />
                  }
                </TableCell>
                <Tooltip title={new Date(Date.parse(spell.date_created)).toLocaleTimeString()} arrow placement="bottom-start">
                  <TableCell>{new Date(Date.parse(spell.date_created)).toLocaleDateString()}</TableCell>
                </Tooltip>
                <Tooltip title={new Date(Date.parse(spell.date_modified)).toLocaleTimeString()} arrow placement="bottom-start">
                  <TableCell>{new Date(Date.parse(spell.date_modified)).toLocaleDateString()}</TableCell>
                </Tooltip>
                <TableCell>{textTrim(spell.name, 15)}</TableCell>
                <TableCell>{textTrim(spell.description, 30)}</TableCell>
                <TableCell width='40%'>{spell.tags.length ? 
                  spell.tags.map(t => (
                    <Chip
                      key={t.id}
                      variant="outlined"
                      size="small"
                      label={t.name}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    />
                  )) : ''}
                </TableCell>
                <TableCell className={classes.icons}>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded == spell.id,
                    })}
                    onClick={(event) => {
                      handleExpandClick(spell.id)
                      event.stopPropagation();
                    }}
                    aria-expanded={expanded == spell.id}
                    aria-label="show more"
                  >
                    <Tooltip title="View Code" placement="top">
                      <CodeIcon />
                    </Tooltip>
                  </IconButton>
                  <Dialog
                    open={expanded == spell.id}
                    onClose={(event) => {
                      handleExpandClick(false)
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    
                    <div className={classes.cardHead}>
                      <DialogTitle id="alert-dialog-title">{`${spell.name}`}</DialogTitle>
                    </div>

                    <div className={classes.cardHead}>
                      <TextField
                        size="small"
                        className={classes.copy}
                        id="read-only-twitch-command"
                        label="Twitch Dictum"
                        defaultValue= {runSpell(spell.id)}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                        aria-owns={popoverOpen ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                        onClick={() => {
                          navigator.clipboard.writeText(runSpell(spell.id))
                          setPopText('Copied!')
                        }}
                      />
                      <Popover
                        id="mouse-over-popover"
                        className={classes.popover}
                        classes={{
                          paper: classes.paper,
                        }}
                        open={popoverOpen}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                      >
                        <Typography>{popText}</Typography>
                      </Popover>
                    </div>

                    <DialogContent className="dialogBox">

                      <DialogContentText id="CodeMirror-Display">
                        <CodeMirror
                          className={classes.codeMirror}
                          value={spell.text}
                          options={{
                            mode: 'scheme',
                            theme: 'material',
                            lineNumbers: true,
                            readOnly: "nocursor",
                          }}
                        />
                      </DialogContentText>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <>
                {spell.locked ? 
                  <>
                    <TableCell className={classes.icons}></TableCell>
                    <TableCell className={classes.icons}>
                      <LockIcon />
                    </TableCell>
                  </>
                  :
                  <>
                  <TableCell className={classes.icons}>
                    <IconButton aria-label="edit" onClick={() => history.push(`/spells/${spell.id}`)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>

                  <TableCell className={classes.icons}>
                    <IconButton 
                    id={spell.id} 
                    aria-label="isPublic" 
                    onClick={(event) => {
                      updateSpell({...spell, is_public: !spell.is_public});
                      event.stopPropagation();
                    }}>
                      {spell.is_public ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </TableCell>
                  </>
                }
                </>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Title>
          <div className={classes.pagi}>
            <Pagination count={Math.ceil(props.totalSpells / spellsPerPage)}
            onChange={(event ,page ) => {
              props.setCurrentPage(page)
              setSelected([])
            }}
            />
          </div>
      </Title>
    </React.Fragment>
    : ''
  );
}