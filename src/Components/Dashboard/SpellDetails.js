import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import TokenService from '../../Services/token-service';
import config from '../../config';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import Title from './Title';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Dashboard from './Dashboard';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import SpellsApiService from '../../Services/spells-api-service';
import Chip from '@material-ui/core/Chip';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import { Autocomplete } from "@material-ui/lab";

let debounceTimer

export default function SpellDetails(props) {
  const classes = useStyles();
  let history = useHistory();

  const [spell, setSpell] = useState();
  const [isSaving, setIsSaving] = useState(false);

  // FIXME: CodeMirror re-render workaround. Needs revision
  const [spellText, setSpellText] = useState(undefined)

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

  useEffect(() => {
    const { id } = props.match.params

    SpellsApiService.getSpellById(id)
      .then(spell => {
        setSpell(spell)
        setSpellText(spell.text);
      })


  }, [])

  const debounce = (func, delay) => {
    // setIsSaving(true);

    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func(), delay)

  }

  let [spellTag, setSpellTag] = useState("");

  const tagWhitelist = [
  { title: 'Fire'},
  { title: 'Ice'},
  { title: 'Water'},
  { title: 'Deception'},
  { title: 'Plant'},
  { title: "Rock"},
  { title: 'Pet'},
  { title: 'Parasite'},
  { title: 'Electric'},
  { title: 'Attack'},
  { title: 'Heal'}
  ]

  const updateSpell = (spell) => {
    setIsSaving(true);

    const { id } = props.match.params

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
        setIsSaving(false)
        setSpell(spell)
      })
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
  }

  function addTagToSpell(id,tag){

    return fetch(`${config.API_ENDPOINT}/spells/${id}/tags/${tag}`, {
      method: 'POST',
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
      .then((tag) => {
        setIsSaving(false)
        setSpell({...spell, tags:[...spell.tags, tag]})
      })
  }

  //Press enter to save tag
  function handleKeyUp(event) {
    if(event.keyCode === 13 && spellTag) {
        addTagToSpell(spell.id, spellTag)
        console.log(spellTag)
        setSpellTag("")
    }
  }

  function removeTagFromSpell(id,tag_name){
    return fetch(`${config.API_ENDPOINT}/spells/${id}/tags/${tag_name}`, {
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
      .then((tag) => {
        setIsSaving(false)
        setSpell({...spell, tags: spell.tags.filter(t => {
          return t.name !== tag_name
        })})
      })
  }

  return (
    <Dashboard>
      {spell ?
      <React.Fragment>
        <div className={classes.titleRow}>
          <div className={classes.metaTitle}></div>
          <div className={classes.metaTitle}>
            <Title className={classes.titleDisplay}>
              {spell.name}
            </Title>
          </div>
          <div className={classes.metaSpinner}>
            {isSaving ? <div className={classes.spinner}>
              <CircularProgress size={30} />
            </div> : <div className={classes.spinner}></div>}
          </div>
        </div>

        <div className={classes.iconRow}>
          <TextField className={classes.title}
            label="Name"
            defaultValue={spell.name}
            onChange={(event) => {
              // console.log(event.target.value);
              setSpell({...spell, name: event.target.value})
              debounce(() => updateSpell({...spell, name: event.target.value}), 3000)
            }}
          />


          <div className={classes.icons}>
            <Tooltip title="Public status" placement="top-end">
              <IconButton className={classes.icons} aria-label="isPublic" onClick={() => {
                setSpell({...spell, is_public: !spell.is_public})
                debounce(() => updateSpell({...spell, is_public: !spell.is_public}), 3000)
              }}>
                {spell.is_public ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete" placement="top-end">
              <IconButton className={classes.icons} aria-label="delete"
                onClick={() => handleClickOpen(spell.id)}
                // onClick={handleClickOpen}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <div>

        {spell.tags.map(t => (
          <Button
          variant="contained"
          onClick={(event) => {
            removeTagFromSpell(spell.id, t.name)
            console.log(t.name)
          }}>{t.name}</Button>
        ))}

          <TextField className={classes.iconRow}
            placeholder="Tag"
            onKeyUp={handleKeyUp}
            value = {spellTag}
            label="Spell Tags"
            onChange={(event) => {
              setSpellTag(event.target.value)
            }}
          />

          <Button
          variant="contained"
          onClick={(event) => {
            if(spellTag){
              addTagToSpell(spell.id, spellTag)
              console.log(spellTag)
            }
            setSpellTag("")
          }}>Add Tag</Button>

{/*
          <Autocomplete
            onChange={(event) => {
              setSpellTag(event.target.value)
            }}
            className={classes.iconRow}
            multiple id="tags-outlined"
            options={tagWhitelist.map((option) => option.title)}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params}
                defaultValue={spell.tags.map(t => (t.name))}
                variant="outlined"
                label="Spell Tags"
                placeholder="Tag"
                onKeyUp={handleKeyUp} />
            )}
          />
          */}
        </div>


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
            <Button onClick={() => {handleClose(); deleteSpell(spell.id); history.push('/spells')}} color="secondary">
              Delete
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              Keep
            </Button>
          </DialogActions>
        </Dialog>

        <TextField className={classes.margin}
          label="Description"
          defaultValue={spell.description}
          fullWidth
          onChange={(event) => {
            setSpell({...spell, description: event.target.value})
            debounce(() => updateSpell({...spell, description: event.target.value}), 3000)
          }}
        />
        <p></p>
        {/* <Typography align='left'>
          Code:
        </Typography> */}
        <div className='CodeMirror'>
          {spellText ?
          <CodeMirror
            value={spellText}
            // value={'Bogus stuff'}
            options={{
              mode: 'scheme',
              theme: 'material',
              lineNumbers: true
            }}
            onChange={(editor, data, value) => {
              setSpell({...spell, text: value})
              debounce(() => updateSpell({...spell, text: value}), 3000)
            }}
          />
          : ''}
        </div>
      </React.Fragment>
      : <div>Spell is loading</div>}
    </Dashboard>
  );
}


const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  title: {
    margin: theme.spacing(1),
    width: '30%',
    justifyContent: 'left'
  },
  spinner: {
    display: 'flex',
    '& > * + *': {
      marginRight: theme.spacing(2),
    },
    // justifyContent: 'right',
  },
  icons: {
    justifyContent: 'right'
  },
  iconRow: {
    display: 'flex',
    // alignContent: 'left'
    justifyContent: 'space-between'
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'center'
  },
  titleDisplay: {
    // justifyContent: 'center',
  },
  metaSpinner: {
    width: '33%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  metaTitle: {
    width: '33%',
  }
}));
