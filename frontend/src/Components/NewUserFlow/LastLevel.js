import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import SpellsApiService from '../../Services/spells-api-service';
import { Chapter } from './Chapter';

function LastChapter(props) {
  const [message, setMessage] = useState();

  return (<Chapter number={999} subtitle={"The end"}>
    <p>When a story ends, there's only one thing to do...</p>
    <Button onClick={() => {
      SpellsApiService.deleteBadgeFromUser("me", "*").then((resp) => {
        setMessage(resp.message) 
        props.setBadges([])
      }) 
    }}>Remove Badges / Start Again</Button>
    <p>{message || ""}</p>
  </Chapter>)
}

export default LastChapter;