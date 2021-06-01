import React, { useEffect, useState } from 'react';
import { useHistory, useParams, Prompt } from "react-router-dom";
import TokenService from '../../Services/token-service';
import config from '../../config';
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
import CheckIcon from '@material-ui/icons/Check';
import CodeMirror from 'codemirror';
import {UnControlled as ReactCodeMirror} from 'react-codemirror2';
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/selection/active-line.js'
import CallSplitIcon from '@material-ui/icons/CallSplit';
import {Helmet} from "react-helmet";
import { BlocklyWorkspace } from "react-blockly";
import Blockly from "blockly";
import "./customBlocks/custom_Blocks";


let debounceTimer

export default function SpellDetails(props) {
  const [xml, setXml] = useState("");
  const [javascriptCode, setJavascriptCode] = useState("");

  const initialXml =
    '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>';
  const toolboxCategories = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Logic",
        colour: "#5C81A6",
        contents: [
          {
            kind: "block",
            type: "controls_if",
          },
          {
            kind: "block",
            type: "logic_compare",
          },
        ],
      },
      {
        kind: "category",
        name: "Math",
        colour: "#5CA65C",
        contents: [
          {
            kind: "block",
            type: "math_round",
          },
          {
            kind: "block",
            type: "math_number",
          },
        ],
      },
      {
        kind: "category",
        name: "Spells",
        colour: "#c1ba31",
        contents: [
          {
            kind: "block",
            type: "atoms",
          },
          {
            kind: "block",
            type: "lists_create_with",
          },
          {
            kind: "block",
            type: "test_react_date_field",
          },
          {
            kind: "block",
            type: "define",
          },
          {
            kind: "block",
            type: "paren",
          },
          {
            kind: "block",
            type: "atom",
          },
         
          {
            kind: "block",
            blockxml:
            '    <block type="text_isEmpty">\n' +
            '      <value name="VALUE">\n' +
            '        <shadow type="text">\n' +
            '          <field name="TEXT"></field>\n' +
            "        </shadow>\n" +
            "      </value>\n" +
            "    </block>\n",
          },
        ],
      },
    ],
  };

  function workspaceDidChange(workspace) {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    //const code = Blockly.Blocks.workspaceToCode(workspace);
    //for sample custom blocks
    //const code = Blockly.Python.workspaceToCode(workspace);
    setJavascriptCode(code);
    setSpellText(code);
  }

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
  const [spellTag, setSpellTag] = useState("");
  const [userOwnsSpell, setUserOwnsSpell] = useState()
  const [error, setError] = useState(null);

  let debounceWait = 2000;
  let spinnerShow = 1000;
  
  const handleClickOpen = (id) => {
    setSpellToDelete(id);
  };

  const handleClose = (id) => {
    setSpellToDelete(undefined);
  };

  const { id } = useParams();
  const path = window.location.pathname;
  
  useEffect(() => {
    let isMounted = true

    SpellsApiService.checkForSpellOwnership(id)
      .then(res => {
        setUserOwnsSpell(res.userOwnsSpell)
      })
    
    SpellsApiService.getSpellById(id)
      .then(spell => {
        if (isMounted) {
          // console.log("spell" , spell)
          setSpell(spell)
          setSpellText(spell.text);
        }
      })
      .catch(res => {
        setError(res.error);
      })

    return () => {
      isMounted = false
    }

  }, [path, id])

  const debounce = (func, delay) => {
    // setIsSaving(true);
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
        setTimeout(() => {  setIsSaving(false); }, spinnerShow);
        // setIsSaving(false)
        setSpell(spell)
      })
      .catch(errors => 
        console.log("UpdateSpell errors" , errors))
  }

  function deleteSpells(id){

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
      .catch(errors => 
        console.log("deleteSpell errors" , errors))
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
      .catch(errors => 
        console.log("add tag errors" , errors))
  }

  //Press enter to save tag
  function handleKeyUp(event) {
    if(event.keyCode === 13 && spellTag) {
        addTagToSpell(spell.id, spellTag)
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
      .catch(errors => 
        console.log("remove tag errors" , errors))
  }

  const clickForkIcon = (id) => {
    // console.log("Before API ", id);
    SpellsApiService.forkSpellById(id)
    .then((spell) => {
      history.push(`/spells/${spell.id}`)
      // console.log("After history ", spell.id);
      // console.log(object);
    })
  }

  return (
    <>
      <Prompt 
        when={isSaving}
        message='Spell is not saved yet'
      />
      {spell ?
      <div>
        <Helmet>
          <title>{spell.name} | CodeSpells Nexus</title>
          <meta name="description" content={spell.description} />
        </Helmet>
        <div className={classes.titleRow}>
          <div className={classes.metaID}>ID: {spell.id}</div>
          <div className={classes.metaTitle}>
            <Title>
              {spell.name}
            </Title>
          </div>
          <div className={classes.metaSpinner}>
            {spell.locked || !userOwnsSpell ?
              '' :
              isSaving ? 
                <div className={classes.spinner}>
                  <CircularProgress size={30} />
                </div> : 
                <div className={classes.spinner}><CheckIcon />
                </div>
            }
          </div>
        </div>
        <p></p>
        <div className={classes.iconRow}>
          {spell.locked || !userOwnsSpell ? 
            <TextField className={classes.spellDetailsTitle}
              id = "spell-details-title"
              label="Name"
              defaultValue={spell.name}
              disabled
            /> :
            <TextField className={classes.spellDetailsTitle}
              id = "spell-details-title-owns"
              label="Name"
              defaultValue={spell.name}
              onChange={(event) => {
                setSpell({...spell, name: event.target.value})
                setTimeout(() => {
                  debounce(() => updateSpell({...spell, name: event.target.value}), debounceWait)
                },500)
              }}
            />
          }
          <div className={classes.spellDetailsImage}>
            <img src='https://i.imgur.com/VE9Aksf.jpg' alt="Spell Image" width='40%'></img>
          </div>
          <div className={classes.iconBox}>
            <div className={classes.spellDetailsIcons}>
              <Tooltip title="Fork Spell" placement="top">
                <IconButton onClick={() => clickForkIcon(spell.id)}>
                  <CallSplitIcon />
                </IconButton>
              </Tooltip>
              {spell.locked || !userOwnsSpell ?
                <Tooltip title="Spell Locked" placement="top">
                  <IconButton >    
                    <LockIcon />
                  </IconButton>
                </Tooltip> 
                :
                <>
                <Tooltip title="Public status" placement="top-end">
                  <IconButton  aria-label="isPublic" onClick={() => {
                    setSpell({...spell, is_public: !spell.is_public})
                    debounce(() => updateSpell({...spell, is_public: !spell.is_public}), debounceWait)
                  }}>
                    {spell.is_public ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" placement="top-end">
                  <IconButton  aria-label="delete"
                    onClick={() => handleClickOpen(spell.id)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
                </>
              }
            </div>
          </div>
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
            <Button onClick={() => {handleClose(); deleteSpells(spell.id); history.push('/spells')}} color="secondary">
              Delete
            </Button>
            <Button onClick={handleClose} color="primary" autoFocus>
              Keep
            </Button>
          </DialogActions>
          </Dialog>
          <div className={classes.iconRow}>
          {spell.locked || !userOwnsSpell ? 
            <TextField className={classes.spellDetailsDescription}
              id = "spell-details-description"
              label="Description"
              defaultValue={spell.description}
              disabled
            />:
            <TextField className={classes.spellDetailsDescription}
              id = "spell-details-description-owns"
              label="Description"
              defaultValue={spell.description}
              onChange={(event) => {
                setSpell({...spell, description: event.target.value})
                setTimeout(() => {
                  debounce(() => updateSpell({...spell, description: event.target.value}), debounceWait)
                },500)
              }}
            />
          }
        </div>
        <p></p>
        <div className={classes.iconRow}>
          {spell.locked || !userOwnsSpell ?
            <TextField className={classes.tagLine}
              placeholder="Tag"
              value = {spellTag}
              label="Spell Tags"
              disabled
            /> :
            <TextField className={classes.tagLine}
              placeholder="Tag"
              onKeyUp={handleKeyUp}
              value = {spellTag}
              label="Spell Tags"
              onChange={(event) => {
                setSpellTag(event.target.value)
              }}
            />
          }
        </div>
        {spell.locked || !userOwnsSpell ? 
          <div className={classes.icon}>
            {spell.tags.map(t => (
              <Chip
              key={t.id}
              variant="outlined"
              size="small"
              label={t.name}
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
              onDelete={() => removeTagFromSpell(spell.id, t.name)}
              />
            ))}
          </div>
        }
        <p></p>

        <h1>Hello World!</h1> 
        
        <BlocklyWorkspace
        toolboxConfiguration={toolboxCategories}
        initialXml={initialXml}
        className={classes.spellDetailsCodeMirror}
        workspaceConfiguration={{
          grid: {
            spacing: 20,
            length: 3,
            colour: "#ccc",
            snap: true,
          },
        }}
        onWorkspaceChange={workspaceDidChange}
        onXmlChange={setXml}
      />
      
      {/* <pre id="generated-xml">{xml}</pre>
      <textarea
        id="code"
        style={{ height: "200px", width: "400px" }}
        value={javascriptCode}
        readOnly
      ></textarea> */}

        <div className={classes.spellDetailsCodeMirror}>
          {spell.locked || !userOwnsSpell ?
            <ReactCodeMirror
              className={classes.spellDetailsCodeMirror}
              value={spellText ? spellText : ''}
              options={{
                lineWrapping: true,
                mode: 'scheme',
                theme: 'material',
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true,
              }}
            /> :
            <ReactCodeMirror
              className={classes.spellDetailsCodeMirror}
              value={spellText ? spellText : ''}
              options={{
                lineWrapping: true,
                mode: 'scheme',
                theme: 'material',
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                styleActiveLine: true,
              }}
              onChange={(editor, data, value) => {
                setSpell({...spell, text: value})
                // setIsSaving(true)
                setTimeout(() => {
                  debounce(() => updateSpell({...spell, text: value}), debounceWait
                )}, 500)
              }}
            />
          }
        </div>
      </div>
      :
      <div role='alert'>
        {error ? <p className='red'>{error}</p> : null}
      </div>}
    </>
  );
}
