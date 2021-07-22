import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from 'react-three-fiber';

export const Camera = props => {
  const ref = useRef();
  /*
  const set = useThree((state) => state.set);

  useEffect(() => {
    //setDefaultCamera(ref.current);
    return void set({camera: ref.current})
  }, []);

  useFrame(() => ref.current.updateMatrixWorld());
  */

  return <perspectiveCamera ref={ref} {...props} />;
};
