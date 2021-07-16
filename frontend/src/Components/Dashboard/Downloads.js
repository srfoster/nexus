// DownloadCards
import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DownloadCard from './DownloadCard'
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Pagination from '@material-ui/lab/Pagination';
import { SearchBar } from '../../Util.js'
import SpellsApiService from '../../Services/spells-api-service';
import Title from './Title';
import styles from '../../styles.js'
import { Helmet } from "react-helmet";
import { DarkModeContext } from '../Context';

function Downloads(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [rowsPerPage, setRowsPerPage] = React.useState(9);
  const [totalSpells, setTotalSpells] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = React.useState('');
  const [games, setGames] = React.useState([]);
  const [totalGames, setTotalGames] = React.useState();
  const [darkMode, setDarkMode] = useContext(DarkModeContext);

    
  useEffect(() => {
    SpellsApiService.getDownloads()
      .then(games => {
        setGames(games.games)
        setTotalGames(games.total)
      })
  }, [])

  return (
    <>
     <Helmet>
        <title>Downloads | CodeSpells Nexus</title>
        <meta name="description" content="Download the latest CodeSpells video games. The spells you write here in the Nexus can be cast inside of these games!" />
      </Helmet>
      <div className={darkMode ? classes.darkHeadBar : classes.headBar}>
        <div className={classes.headLeft}></div>
        <h4 className={classes.headTitle}>Downloads</h4>
        <div className={classes.headRight}></div>
      </div>
      
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {games.map((game) => (
            <DownloadCard game={game} key={'Key ', game.id}/>
          ))}
        </Grid>
      </Container>
      
      {/* <div className={classes.publicSpellsRoot}>
        <Pagination count={Math.ceil(totalSpells / rowsPerPage)}
          onChange={(event, page) => {setCurrentPage(page)}}
        />
      </div> */}
    </>
  );
}
export default Downloads;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  spellcardCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
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
  darkHeadBar: {
    justifyContent: 'space-between',
    fontSize: '1.5rem',
    display: 'inline-flex',
    width: 'auto',
    fontFamily: "Roboto",
    fontWeight: '400',
    lineHeight: '1.334',
    letterSpacing: '0em',
    color: 'white',
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