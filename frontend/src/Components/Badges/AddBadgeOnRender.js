import React, { useEffect, useState } from 'react';
import SpellsApiService from '../../Services/spells-api-service';
import { BadgeConfirmation } from './badgeUtil';

//Don't forget to complete the badge data in backend/src/badgeDataList.js
export const badgeWhitelist = ['Getting-Started']

export function badgeOnWhitelist(badgeName) {
  let boolean = badgeWhitelist.includes(badgeName)
  return boolean
}

function AddBadgeOnRender(props) {
  const [gotBadge,setGotBadge] = useState(false)

  if(!badgeOnWhitelist(props.name)){
    throw 'Badge not on white list: ' + props.name 
  }

  useEffect(() => {
    SpellsApiService.addBadgeToUser(props.name)
      .then((resp) => {
        if (resp.id) //A successful response returns a badge with an id. Otherwise {message: ...}
          setGotBadge(true)
      })
  }, [props.name])

  return (
    <>
      {gotBadge ? <BadgeConfirmation name={props.name} /> : ""}
    </>
  );
}

export default AddBadgeOnRender;