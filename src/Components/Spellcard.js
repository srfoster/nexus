import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import SpellsApiService from '../Services/spells-api-service';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import CodeIcon from '@material-ui/icons/Code';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
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
    <Grid item key={props.spell.id} xs={12} sm={6} md={4}>
      <Card className={classes.card}>
      <CardHeader
        // avatar={
        //   <Avatar aria-label="recipe" className={classes.avatar}>
        //     R
        //   </Avatar>
        // }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={textTrim(props.spell.name, 19)}
        subheader={new Date(Date.parse(props.spell.date_created)).toLocaleDateString()}
      />

        <CardMedia
          className={classes.cardMedia}
          // image={props.cardImage}
          image="https://i.imgur.com/33XGUsG.jpg"
          title={"Image title" + props.spell.id}
        />

        <CardContent className={classes.cardContent}>
          <Typography>
            {textTrim(props.spell.description, 30)}
          </Typography>
        </CardContent>

        <div className={classes.chip}>
        {props.spell.tags.map(t => (
          <Chip
          key={t.id}
          variant="outlined"
          size="small"
          label={t.name}
          // onClick={(event) => {
          // }}
          />
        ))}
        </div>

        <CardActions className={classes.footer}>
          <IconButton onClick={() => clickForkIcon(props.spell.id)}>
            <Tooltip title="Fork Spell" placement="top">
              <CallSplitIcon />
            </Tooltip>
          </IconButton>

          {props.spell.locked ? <LockIcon /> : ""}
          
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <Tooltip title="View Code" placement="top">
              <CodeIcon />
            </Tooltip>
          </IconButton>
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
            id="read-only-spell-command"
            // label="Spell Command"
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
                value={props.spell.text}
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
      </Card>
    </Grid>
  )
};

const useStyles = makeStyles((theme) => ({
  album: {
  },
  // card: {
  //   maxWidth: 345,
  //   margin: '1%',
  // },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  chip: {
    flexDirection:'row',
    display: 'flex',
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9

    color: "blue",
  },
  cardContent: {
    // flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  codeMirror: {
    height: '60vh',
    width: '29vw',
  },
  copy: {
    justifyContent: 'center',
    width: '14ch',
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'center'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

export default Spellcard;
