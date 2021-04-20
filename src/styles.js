import { makeStyles, fade } from '@material-ui/core/styles';
import clsx from 'clsx';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({

  // Dashboard //
  dashRoot: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  dashMenuButton: {
    marginRight: 36,
  },
  dashMenuButtonHidden: {
    display: 'none',
  },
  dashTitle: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,},
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  dashContainer: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  dashPaper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  link: {
    width: '10%',
  },

  //FabAddIcon //
  fab: {
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },

  // ListItems //
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

  // SpellChart //
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

  // SpellDetails //
  spellDetailsTitle: {
    margin: theme.spacing(1),
    width: '33%',
    justifyContent: 'left'
  },
  spellDetailsDescription: {
    margin: theme.spacing(1),
    width: '100%',
    justifyContent: 'left'
  },
  spinner: {
    display: 'flex',
    '& > * + *': {
      marginRight: theme.spacing(2),
    },
  },
  spellDetailsIcons: {
    width: '33%',
    display: 'flex',
    // justifyContent: "flex-end",
  },
  singleIcon:{
    justifyContent: 'flex-end',
  },
  spellDetailsTooltip: {
    display: 'flex'
  },
  iconRow: {
    display: 'flex',
    justifyContent: 'center'
  },
  iconBut: {
    display: 'flex',
    margin: theme.spacing(1),
    justifyContent: 'left'
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'center'
  },
  metaSpinner: {
    width: '33%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  metaTitle: {
    width: '33%',
  },
  spellDetailsCodeMirror: {
    height: '300px',
  },
  spellDetailsLocked: {
    pointerEvents: 'none',
  },
  
  // PublicSpells //
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
      display: 'flex',
    justifyContent: 'center',
    },
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
}));

export default useStyles