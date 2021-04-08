import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';
import Pagination from '@material-ui/lab/Pagination';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

export default function PublicSpells(props) {
  // console.log("From index: ", props);

  const [spells, setSpells] = useState([])
  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = React.useState(9);
  const [totalSpells, setTotalSpells] = React.useState(0);

  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = React.useState('');

  useEffect(() => {

    SpellsApiService.getPublicSpells(currentPage, search)
      .then(spells => {
        setSpells(spells.spells)
        setTotalSpells(spells.total)
      })

  }, [currentPage, search])
  // console.log(spells);

  function onSearchChange(event) {
    setSearch(event.target.value)
  }

  function SearchAppBar() {

    return (
      <>       
       
        <InputBase
          placeholder="Search Spells"
          onChange={onSearchChange}
          inputProps={{ 'aria-label': 'search' }}
        />
      
         <SearchIcon />
       
      </>
    )
  }

  return (
    <>
      <div className={classes.headBar}>
        <div className={classes.headLeft}></div>
        <div className={classes.headTitle}>Public Spells</div>
        <div className={classes.headRight}>{SearchAppBar()}</div>
      </div>
      <Spellbook spells={spells}/>
      <Title>
          <div className={classes.root}>
            <Pagination count={Math.ceil(totalSpells / rowsPerPage)}
              onChange={(event ,page ) => {setCurrentPage(page)}}
            // //function(event: object, page: number) => void
            // //event: The event source of the callback.
            // //page: The page selected.
            />
          </div>
      </Title>
    </>
  );
}


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
    // backgroundColor: red[500],
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
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
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
  }
}));
