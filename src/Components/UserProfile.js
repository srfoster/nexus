import React, { useEffect, useState } from 'react';
import TokenService from '../Services/token-service';
import config from '../config';
import Title from './Dashboard/Title';
import SpellsApiService from '../Services/spells-api-service';
import Spellbook from './Spellbook';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const UserProfile = (props) => {
  const classes = useStyles();
  const [user, setUser] = useState(undefined)
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = useState(1)


  useEffect(() => {
    const { id } = props.match.params

    SpellsApiService.getUserById(id, currentPage)
      .then(user => {
        setUser(user)
      })
  },[currentPage])

  return (
    user ?
      <>
        <Title>{`Spellbook of ${user.username}`}</Title>
        <Spellbook spells={user.spells}/>
        <Title>
            <div className={classes.root}>
              <Pagination count={Math.ceil(user.total / rowsPerPage)}
                onChange={(event ,page ) => {setCurrentPage(page)}}
               // //function(event: object, page: number) => void
              // //event: The event source of the callback.
              // //page: The page selected.
              />
            </div>
        </Title>
      </>
    : ''
  );
};

const useStyles = makeStyles((theme) => ({
name: {
  textAlign: "left",
},
root: {
  '& > *': {
    marginTop: theme.spacing(2),
    display: 'flex',
  justifyContent: 'center',
  },
},
}));

export default UserProfile;
