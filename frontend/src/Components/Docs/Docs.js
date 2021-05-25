// Doc Page

import React, { useState, useEffect } from 'react';

function Docs(props) {
  const { id } = props.match.params
  
  return (
    <>
      <p>HELLO DOCS!! {id}</p>
    </>
  );
}

export default Docs;