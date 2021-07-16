import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import SpellsApiService from '../Services/spells-api-service';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import CodeIcon from '@material-ui/icons/Code';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import {textTrim} from '../Util.js'
import TextField from '@material-ui/core/TextField';
import LockIcon from '@material-ui/icons/Lock';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useStyles from '../styles.js';
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/selection/active-line.js'
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


const Spellcard = (props) => {
  const classes = useStyles();
  let history = useHistory();
  const [expanded, setExpanded] = React.useState(false);
  const runSpell= "!!run " + props.spell.id
  const [anchorEl, setAnchorEl] = React.useState(null);
  const popoverOpen = Boolean(anchorEl);
  const [popText, setPopText] = React.useState('Click To Copy')

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const clickForkIcon = (id) => {
    SpellsApiService.forkSpellById(id)
    .then((spell) => {
      history.push(`/spells/${spell.id}`)
    })
  }

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopText('Click To Copy')
  }

  return (
    <Grid className={'Card Frame'} item key={'Frame ' + props.spell.id} xs={12} sm={6} md={4}>
      <Card className={classes.spellcardCard}>
      <CardHeader
        avatar={
          <Tooltip title={`${props.spell.author}`} placement='top'>
            <Button onClick={() => history.push(`/mages/${props.spell.user_id}`)}>
              <Avatar aria-label="recipe" className={classes.spellcardAvatar}>
                {props.spell.author.slice(0,1).toUpperCase()}
              </Avatar>
            </Button>
          </Tooltip>
        }
        action={
          <Tooltip title='View Details' placement='top'>
            <IconButton aria-label="settings" onClick={() => history.push(`/spells/${props.spell.id}`)}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Tooltip>
        }
        title={textTrim(props.spell.name, 19)}
        subheader={new Date(Date.parse(props.spell.date_modified)).toLocaleDateString()}
      />
        <CardMedia
          className={classes.spellcardCardMedia}
          // image={props.cardImage}
          // image="https://i.imgur.com/33XGUsG.jpg"
          image="https://i.imgur.com/KEPVIOS.jpg"
          title={"Image title" + props.spell.id}
        />
        <CardContent >
          <Typography>
            {textTrim(props.spell.description, 30)}
          </Typography>
        </CardContent>
        <div className={classes.spellcardChip}>
        {props.spell.tags.map(t => (
          <Chip
          key={'tags ' + t.id}
          variant="outlined"
          size="small"
          label={t.name}
          // onClick={(event) => {
          // }}
          />
        ))}
        </div>
        <CardActions className={classes.spellcardFooter}>
          <Tooltip title="Fork Spell" placement="top">
            <IconButton onClick={() => clickForkIcon(props.spell.id)}>
              <CallSplitIcon />
            </IconButton>
          </Tooltip>
          {props.spell.locked ? <LockIcon /> : ""}
          ID: {props.spell.id}
          <Tooltip title="View Code" placement="top">
            <IconButton
              className={clsx(classes.spellcardExpand, {
                [classes.spellcardExpandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
        <Dialog
          // open={open}
          open={expanded}
          onClose={handleExpandClick}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className={classes.cardHead}>
            <DialogTitle id="alert-dialog-title">{`${props.spell.name}`}</DialogTitle>
          </div>
          <div className={classes.cardHead}>
            <TextField
            size="small"
            className={classes.copy}
            id="read-only-twitch-command"
            label="Twitch Dictum"
            defaultValue= {runSpell}
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            aria-owns={popoverOpen ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            onClick={() =>  {
              navigator.clipboard.writeText(runSpell)
              setPopText('Copied!')
            }}
            />
            <Popover
              id="mouse-over-popover"
              className={classes.spellcardPopover}
              classes={{
                paper: classes.spellcardPaper,
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
                value={props.spell.text}
                options={{
                  lineWrapping: true,
                  mode: 'scheme',
                  theme: 'material',
                  lineNumbers: true,
                  matchBrackets: true,
                  autoCloseBrackets: true,
                  styleActiveLine: true,
                }}
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Card>
    </Grid>
  )
};

export default Spellcard;
