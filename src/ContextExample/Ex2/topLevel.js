import React from 'react';
// other imports
import { DaylightContextProvider } from './data/context/daylight-context';

function App() {
  return (
    // …
    <DaylightContextProvider>
      // …
      // components that use the Context need to be rendered as its children in the React tree
    </DaylightContextProvider>
    // …
  );
}

export default App;