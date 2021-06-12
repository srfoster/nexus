import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';
import { Stage, Layer, Star, Text } from 'react-konva';

function generateShapes() {
  return [...Array(50)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const INITIAL_STATE = generateShapes();

function Stars() {
  const [stars, setStars] = React.useState(INITIAL_STATE);

  const handleDragStart = (e) => {
    const id = e.target.id();
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: star.id === id,
        };
      })
    );
  };
  
  const handleDragEnd = (e) => {
    setStars(
      stars.map((star) => {
        return {
          ...star,
          isDragging: false,
        };
      })
    );
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Text text="Try to drag a star" />
        {stars.map((star) => (
          <Star
            key={star.id}
            id={star.id}
            x={star.x}
            y={star.y}
            numPoints={5}
            innerRadius={10}
            outerRadius={20}
            fill="#89b717"
            opacity={0.8}
            draggable
            rotation={star.rotation}
            shadowColor="purple"
            shadowBlur={10}
            shadowOpacity={0.6}
            shadowOffsetX={star.isDragging ? 10 : 5}
            shadowOffsetY={star.isDragging ? 10 : 5}
            scaleX={star.isDragging ? 1.2 : 1}
            scaleY={star.isDragging ? 1.2 : 1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </Layer>
    </Stage>
  );
};

function Level33(props) {
  const [showButton, setShowButton] = React.useState(false);  

  return (
    <Level number={33} subtitle={"I'm seeing stars!"}>
      <React.Fragment>
      <ContinueButton
        onComplete={() => {
          props.setBadges(props.badges.concat([{ name: props.badgeName }]));
        }}
      ></ContinueButton>
      
      <Stars />
      </React.Fragment>
    </Level>
  );
}

export default Level33;