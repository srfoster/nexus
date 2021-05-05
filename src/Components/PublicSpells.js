import React, { useEffect, useState } from 'react';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';
import Pagination from '@material-ui/lab/Pagination';
import {SearchBar} from '../Util.js'
import useStyles from '../styles.js';

export default function PublicSpells(props) {
  // console.log("From index: ", props);
  const [spells, setSpells] = useState([])
  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = React.useState(9);
  const [totalSpells, setTotalSpells] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = React.useState('');

  useEffect(() => {
    let isMounted = true
    SpellsApiService.getPublicSpells(currentPage, search)
      .then(spells => {
        if(isMounted){
          setSpells(spells.spells)
          setTotalSpells(spells.total)
        }
      })
    return () => {
      isMounted = false
    }
  }, [currentPage, search])

  return (
    <>
      <div className={classes.headBar}>
        <div className={classes.headLeft}></div>
        <div className={classes.headTitle}>Public Spells</div>
        <div className={classes.headRight}><SearchBar setSearch={setSearch}/></div>
      </div>
      <Spellbook spells={spells}/>
      <Title>
          <div className={classes.publicSpellsRoot}>
            <Pagination count={Math.ceil(totalSpells / rowsPerPage)}
              onChange={(event ,page ) => {setCurrentPage(page)}}
            />
          </div>
      </Title>
    </>
  );
}