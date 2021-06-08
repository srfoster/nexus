import React, { useEffect, useState } from 'react';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Typography from '@material-ui/core/Typography';
import Spellbook from './Spellbook';
import Pagination from '@material-ui/lab/Pagination';
import {SearchBar} from '../Util.js'
import useStyles from '../styles.js';
import {Helmet} from "react-helmet";

export default function PublicSpells(props) {
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
      <Helmet>
        <title>Public Spells | CodeSpells Nexus</title>
        <meta name="description" content="You can find all spells that have been made public here. These spells can be cast inside of CodeSpells game, or forked and edited!" />
      </Helmet>
      <div className={props.darkMode ? classes.darkHeadBar : classes.headBar}>
        <div className={classes.headLeft}></div>
        <h4 className={classes.headTitle}>Public Spells</h4>
        <div className={classes.headRight}><SearchBar setSearch={setSearch} setCurrentPage={setCurrentPage}/></div>
      </div>
      <Spellbook spells={spells}/>
      <div className={classes.publicSpellsRoot}>
        <Pagination count={Math.ceil(totalSpells / rowsPerPage)}
          onChange={(event, page) => {setCurrentPage(page)}}
        />
      </div>
    </>
  );
}