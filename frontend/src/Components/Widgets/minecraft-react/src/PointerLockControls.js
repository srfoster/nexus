import React, { useEffect } from 'react';
import { PointerLockControls as PointerLockControlsImpl } from 'three/examples/jsm/controls/PointerLockControls';
import { useThree, extend } from 'react-three-fiber';
import { useRef } from 'react';

extend({ PointerLockControlsImpl });

export const PointerLockControls = props => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    document.addEventListener('click', () => {
      if (controls.current)//Seems to be null, why? ~SF
        controls.current.lock();
    });
  }, [controls]);

  return (
    <pointerLockControlsImpl
      ref={controls}
      args={[camera, gl.domElement]}
      {...props}
    />
  );
};
