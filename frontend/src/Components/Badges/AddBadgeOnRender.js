import React, { useEffect, useState } from 'react';
import SpellsApiService from '../../Services/spells-api-service';
import { BadgeConfirmation } from './badgeUtil';

function AddBadgeOnRender(props) {
  const [gotBadge,setGotBadge] = useState(false)

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