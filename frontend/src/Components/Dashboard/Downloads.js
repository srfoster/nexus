// DownloadCards
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DownloadCard from './DownloadCard'
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Pagination from '@material-ui/lab/Pagination';
import {SearchBar} from '../../Util.js'

function Downloads() {
  const classes = useStyles();
  const theme = useTheme();
  const cardNumber = [1, 2, 3, 4, 5];
  const [rowsPerPage, setRowsPerPage] = React.useState(9);
  const [totalSpells, setTotalSpells] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = React.useState('');

  return (
    <>
      <div className={classes.headBar}>
        <div className={classes.headLeft}></div>
        <div className={classes.headTitle}>Public Spells</div>
        <div className={classes.headRight}><SearchBar setSearch={setSearch} setCurrentPage={setCurrentPage}/></div>
      </div>
      
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {cardNumber.map((item) => (
            <DownloadCard key={'Key ', item}/>
          ))}
        </Grid>
      </Container>
      
      <div className={classes.publicSpellsRoot}>
        <Pagination count={Math.ceil(totalSpells / rowsPerPage)}
          onChange={(event, page) => {setCurrentPage(page)}}
        />
      </div>
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