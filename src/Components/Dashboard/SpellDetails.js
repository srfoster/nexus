import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";
import TokenService from '../../Services/token-service';
import config from '../../config';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import Title from './Title';
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
import LockIcon from '@material-ui/icons/Lock';
import useStyles from '../../styles.js';

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
  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState('');
  let [spellTag, setSpellTag] = useState("");
  
  const handleClickOpen = (id) => {
    setSpellToDelete(id);
  };

  const handleClose = (id) => {
    setSpellToDelete(undefined);
  };

  const { id } = useParams();
  useEffect(() => {

  SpellsApiService.getSpellById(id)
    .then(spell => {
      setSpell(spell)
      setSpellText(spell.text);
    })
  }, [])

  const debounce = (func, delay) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func(), delay)
  }

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

    let payload = spell

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

    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
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
    <>
      {spell ?
      <div className={spell.locked ? classes.spellDetailsLocked : ''}>
        <div className={classes.titleRow}>
          <div className={classes.metaTitle}></div>
          <div className={classes.metaTitle}>
            <Title>
              {spell.name}
            </Title>
          </div>
          <div className={classes.metaSpinner}>
            {isSaving ? <div className={classes.spinner}>
              <CircularProgress size={30} />
            </div> : <div className={classes.spinner}></div>}
          </div>
        </div>
        <p></p>
        <div className={classes.iconRow}>
          <TextField className={classes.spellDetailsTitle}
            label="Name"
            defaultValue={spell.name}
            onChange={(event) => {
              setSpell({...spell, name: event.target.value})
              debounce(() => updateSpell({...spell, name: event.target.value}), 3000)
            }}
          />
          <div width="33%"><img src='https://i.imgur.com/VE9Aksf.jpg' alt="Spell Image" width='40%'></img></div>
          {spell.locked ?
            <div className={classes.spellDetailsIcons}>
              <Tooltip title="Spell Locked" placement="top-end">
                <LockIcon />
              </Tooltip>
            </div>
            :
            <div className={classes.spellDetailsIcons}>
              <Tooltip title="Public status" placement="top-end">
                <IconButton  className={classes.singleIcon} aria-label="isPublic" onClick={() => {
                  setSpell({...spell, is_public: !spell.is_public})
                  debounce(() => updateSpell({...spell, is_public: !spell.is_public}), 3000)
                }}>
                  {spell.is_public ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" placement="top-end">
                <IconButton className={classes.singleIcon} aria-label="delete"
                  onClick={() => handleClickOpen(spell.id)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </div>
          }
        </div>
         {/* Delete Spell dialog confirmation */}
         <Dialog
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
        <div className={classes.iconRow}>
          <TextField className={classes.spellDetailsDescription}
            label="Description"
            defaultValue={spell.description}
            onChange={(event) => {
              setSpell({...spell, description: event.target.value})
              debounce(() => updateSpell({...spell, description: event.target.value}), 3000)
            }}
          />
        </div>
        <p></p>
        <div className={classes.iconRow}>
          <TextField
            className={classes.spellDetailsTitle}
            placeholder="Tag"
            onKeyUp={handleKeyUp}
            value = {spellTag}
            label="Spell Tags"
            onChange={(event) => {
              setSpellTag(event.target.value)
            }}
          />
        </div>
        {spell.locked ? 
          <div className={classes.icon}>
            {spell.tags.map(t => (
              <Chip
              key={t.id}
              variant="outlined"
              size="small"
              label={t.name}
              onClick={(event) => {
                console.log(t.name)
              }}
              />
            ))}
          </div>
          :
          <div className={classes.icon}>
            {spell.tags.map(t => (
              <Chip
              key={t.id}
              variant="outlined"
              size="small"
              label={t.name}
              onClick={(event) => {
                console.log(t.name)
              }}
              onDelete={() => removeTagFromSpell(spell.id, t.name)}
              />
            ))}
          </div>
        }
        <p></p> 
        <div className={classes.spellDetailsCodeMirror}>
          <CodeMirror
            className={classes.spellDetailsCodeMirror}
            value={spellText ? spellText : ''}
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
        </div>
      </div>
      : <div>Spell is loading</div>}
    </>
  );
}