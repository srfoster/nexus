import React from 'react';
import { useHistory } from "react-router-dom";
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TokenService from '../../Services/token-service';
import config from '../../config';

export default function SpellChart(props) {
  const classes = useStyles();
  let history = useHistory();

  function byName( a, b ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }

  function textTrim(text, length){
    if (!text) return '';
    
    if(text.length > length){
      return text.slice(0, length) + '...';
    } else { 
      return text;
    }
  }

  function deleteSpell(id){
    // console.log("Clicked delete", id);

    return fetch(`${config.API_ENDPOINT}/spells/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      // body: JSON.stringify(payload)
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  }

  return (
    <React.Fragment>
      <Title>My Spells</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Created</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Code</TableCell>
            <TableCell align="right">Edit</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.spells.sort(byName).map((spell) => (
            <TableRow key={spell.id}>
              <TableCell>{new Date(Date.parse(spell.date_created)).toLocaleDateString()}</TableCell>
              <TableCell>{textTrim(spell.name, 15)}</TableCell>
              <TableCell>{textTrim(spell.description, 30)}</TableCell>
              <TableCell>{textTrim(spell.text, 65)}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="edit" onClick={() => history.push(`/spells/${spell.id}`)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell align="right">
                <IconButton aria-label="edit" onClick={() => deleteSpell(spell.id)}>
                  <DeleteForeverIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));