// DownloadCards
import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DownloadCard from './DownloadCard'
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Pagination from '@material-ui/lab/Pagination';
import { SearchBar } from '../../Util.js'
import SpellsApiService from '../../Services/spells-api-service';
import Title from './Title';
import styles from '../../styles.js'

function Downloads() {
  const classes = useStyles();
  const theme = useTheme();
  const [rowsPerPage, setRowsPerPage] = React.useState(9);
  const [totalSpells, setTotalSpells] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = React.useState('');
  const [games, setGames] = React.useState([]);
  const [totalGames, setTotalGames] = React.useState(0);
    
  useEffect(() => {
    SpellsApiService.getDownloads()
      .then(games => {
        setGames(games.games)
        setTotalGames(games.total)
      })
  }, [])

  console.log(games, totalGames)

  return (
    <>
      <div className={classes.headBar}>
        <div className={classes.headLeft}></div>
        <Title className={classes.headTitle}>Downloads</Title>
        {/* <div className={classes.headRight}><SearchBar setSearch={setSearch} setCurrentPage={setCurrentPage}/></div> */}
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
}));