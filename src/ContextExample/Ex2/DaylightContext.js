import React from 'react';

const DaylightContext = React.createContext({});

export function DaylightContextProvider(props) {
  const currentDate = new Date();
  const hour = currentDate.getHours();
  const isDaylight = hour > 8 || hour < 20;
  
  return (
    <DaylightContext.Provider value={{ isDaylight: isDaylight }}>
      {props.children}
    </DaylightContext.Provider>
  );
}

export const useDaylightContext = () => React.useContext(DaylightContext);