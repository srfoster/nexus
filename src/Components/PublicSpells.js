import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';
import Pagination from '@material-ui/lab/Pagination';

export default function PublicSpells(props) {
  // console.log("From index: ", props);

  const [spells, setSpells] = useState([])
  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = React.useState(9);
  const [totalSpells, setTotalSpells] = React.useState(0);

  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {

    SpellsApiService.getPublicSpells(currentPage)
      .then(spells => {
        setSpells(spells.spells)
        setTotalSpells(spells.total)
      })

  }, [currentPage])
  // console.log(spells);

  return (
    <>
      <Title>Public Spells</Title>
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
}));
