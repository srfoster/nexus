import React, { useEffect, useState } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import TokenService from '../Services/token-service';
import config from '../config';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function SpellIndex(props) {
  const classes = accordionStyles();

  const [spells, setSpells] = useState([])
  
  useEffect(() => {
    return fetch(`${config.API_ENDPOINT}/spells`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
      .then(spells => setSpells(spells))
  }, [])

  return (
    <div className={classes.root}>
      <Accordion>
        {console.log(spells)}
        Total Spells: {spells.length} <br/>
        {/* {spells[0].name} */}
        {spells.sort((a,b) => a-b).map(spell => {
          return (
            <div>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>{spell.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {spell.description}
                  <Link to={`/spells/${spell.id}`}>Edit</Link>
                </Typography>
              </AccordionDetails>

            </div>
          )
        })}
      </Accordion>
    </div>
  )
}

const accordionStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default SpellIndex;