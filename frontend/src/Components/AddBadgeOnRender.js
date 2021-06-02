import React, { useEffect, useState } from 'react';
import SpellsApiService from '../Services/spells-api-service';

function AddBadgeOnRender(props) {
  useEffect(() => {
    SpellsApiService.addBadgeToUser(props.name)
      .then()
  }, [props.name])

  return (
    <>
      
    </>
  );
}

export default AddBadgeOnRender;