import { makeStyles, fade } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

  // SpellChart
  icons: {
    width: '32px',
    textAlign: 'center',
  },
  title: {
    display: 'flex',
    flex: '1 1 100%',
  },
  pagi: {
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    maxHeight: '70vh',
  },
  headBar: {
    justifyContent: 'space-between',
    fontSize: '1.5rem',
    display: 'inline-flex',
    width: 'auto',
    fontFamily: "Roboto",
    fontWeight: '400',
    lineHeight: '1.334',
    letterSpacing: '0em',
    color: '#3f51b5',
  },
  headLeft: {
    flexGrow: '5',
    display: 'inline-flex',
  },
  headTitle: {
    flexGrow: '3',
    display: 'inline-flex',
  },
  headRight: {
    flexGrow: '1',
    width: '120px',
    display: 'inline-flex',
    justifyContent: 'flex-end',
  },
  root: {
    width: '100%',
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
  codeMirror: {
    height: '60vh', 
    width: '29vw',
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
  searchField: {
    width: '114px',
  },
  searchFieldHidden: {
    width: '0px',
  },
  copy: {
    justifyContent: 'center',
    width: '14ch',
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'center'
  },
  popover: {
    pointerEvents: 'none',
    justifyContent: 'center',
    width: '100%',
    padding: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
  },


// ListItems
root: {
  flexGrow: 1,
},
menuButton: {
  marginRight: theme.spacing(2),
},
title: {
  flexGrow: 1,
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
},
search: {
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: fade(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: fade(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
},
searchIcon: {
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},
inputRoot: {
  color: 'inherit',
},
inputInput: {
  padding: theme.spacing(1, 1, 1, 0),
  // vertical padding + font size from searchIcon
  paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
  transition: theme.transitions.create('width'),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '12ch',
    '&:focus': {
      width: '20ch',
    },
  },
},


}));
export default useStyles
