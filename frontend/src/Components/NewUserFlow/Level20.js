import React, { useEffect, useState } from 'react';
import { Level, ContinueButton } from './Level';
import Button from '@material-ui/core/Button';
import ReactTerminal from '../ReactTerminal';
import Grid from "@material-ui/core/Grid";
import { Stage, Layer, Star, Text } from 'react-konva';


function generateShapes() {
  return [...Array(55)].map((_, i) => ({
    id: i.toString(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
}

const INITIAL_STATE = generateShapes();

export function Stars({rotation, starColor, numPoints}) {
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
            numPoints={numPoints}
            innerRadius={8}
            outerRadius={20}
            fill={starColor}
            opacity={.8}
            draggable
            rotation={rotation}
            shadowColor="purple"
            shadowBlur={6}
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

function Level20(props) {
  const [showButton, setShowButton] = React.useState(false);  
  const [showStars, setShowStars] = React.useState(false);
  const [numPoints, setNumPoints] = useState(4);
  const [starColor, setStarColor] = useState("green")

  return (
    <Level number={20} subtitle={"You've reached terminal buttonosity!"}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <div style={{zIndex:0, position:"relative"}}>
            {showStars ? (
              <Stars numPoints={numPoints} starColor={starColor}/>
            ) : (
              ""
            )}
          </div>
        </Grid>
        <Grid item md={6}>
          <div style={{zIndex:1, position:"relative"}}>
          <ReactTerminal setShowButton={setShowButton} setShowStars={setShowStars} setNumPoints={setNumPoints}
            setStarColor={setStarColor}/>
          </div>
        </Grid>
      </Grid>
      {/* <ReactTerminal setShowButton={setShowButton} /> */}
      <ContinueButton
        onComplete={() => {
          props.setBadges(props.badges.concat([{ name: props.badgeName }]));
        }}
      ></ContinueButton>
      {showButton ? (
        <Button variant="contained" color="primary">
          Button
        </Button>
      ) : (
        ""
      )}
    </Level>
  );
}

export default Level20;