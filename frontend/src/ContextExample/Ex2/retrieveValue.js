import React from 'react';
import { useDaylightContext } from '../../data/context/daylight-context';

export function ExampleComponent(props) {
  const daylight = useDaylightContext();
  
  if (daylight.isDaylight) {
    // …
  }

  return (
    // …
  );
}