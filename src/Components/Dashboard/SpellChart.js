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

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

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

  return (
    <React.Fragment>
      <Title>Recent Spells</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Created</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Code</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.spells.sort(byName).map((spell) => (
            <TableRow key={spell.id}>
              <TableCell>{new Date(Date.parse(spell.date_created)).toLocaleDateString()}</TableCell>
              <TableCell>{spell.name}</TableCell>
              <TableCell>{spell.description}</TableCell>
              <TableCell>{spell.text}</TableCell>
              <TableCell align="right">
              <IconButton aria-label="edit" onClick={() => history.push(`/spells/${spell.id}`)}>
                <EditIcon />
              </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}