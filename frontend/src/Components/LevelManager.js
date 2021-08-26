import React, { useEffect, useState } from 'react';
import { useLocalStorage } from "../Util";
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import SpellsApiService from '../Services/spells-api-service';
import { Helmet } from "react-helmet";
import TokenService from '../Services/token-service';
import Container from '@material-ui/core/Container';

import Level1 from "./NewUserFlow/Level1"
import Level2 from "./NewUserFlow/Level2";
import Level3 from "./NewUserFlow/Level3";
import Level4 from "./NewUserFlow/Level4";
import Level5 from "./NewUserFlow/Level5";
import Level6 from "./NewUserFlow/Level6";
import Level7 from "./NewUserFlow/Level7";
import Level8 from "./NewUserFlow/Level8";
import Level9 from "./NewUserFlow/Level9";
import Level10 from "./NewUserFlow/Level10";
import LastLevel from "./NewUserFlow/LastLevel";

// Badge -> Boolean
function finished(badge) {
  console.log(badge)
  return badge.name.startsWith("Finished:")
}

// Badges -> Integer between 2 - infinity
// If you're not logged in, you see Ch 1
function currentLevelNum(badges) {
  return badges.filter(finished).length + 2;
}

export const LevelTableOfContents = (props) => {

  function clearCurrentPuzzleData() {
    for (let key of Object.keys(localStorage)) {
      if (key.match(/^lvl\d+:currentPart/)) {
        localStorage.setItem(key, 0) 
      }
      if (key.match(/sock-puppet-lesson-opened/)) {
        localStorage.setItem(key, false)
      }
    }
  }
  
  return (<>
    {props.levels.map((e, i) => {
      return <Button
        onClick={() => {
          clearCurrentPuzzleData()
          props.setCurrentLevelNum(i + 1)
        }}>Level {i+1}
      </Button>
    })}
  </>)
}

const LevelManager = (props) => {
  const [badges, setBadges] = useState(undefined);
  const [currentLevelNum, setCurrentLevelNum] = useLocalStorage("current-level-num", props.startingLevel || 1);

  useEffect(() => {
    if (props.backgroundTransparent) {
      document.body.style.setProperty("background-color", "transparent", "important");
    } else {
      document.body.style.setProperty("background-color", "");
    }
   }, [])

  const gotoNextLevel = () => {
    if (props.endingLevel && currentLevelNum + 1 > props.endingLevel ) {
      setCurrentLevelNum(levels.length);
    }
    else {
      setCurrentLevelNum(currentLevelNum + 1)
    }
  }

  const gotoPrevLevel = () => {
    setCurrentLevelNum(currentLevelNum - 1)
  }

  const levels = [
    <Container
      maxWidth="sm">
      <div style={{ padding: 10 }}>
        <Level1
          dummy="dummy"
          setBadges={setBadges}
          badges={badges}
          badgeName={"Finished:ch1:Introduction"}
          gotoNextLevel={gotoNextLevel}
          gotoPrevLevel={gotoPrevLevel}
        />
      </div>
    </Container>
    ,
        <Container
          maxWidth="sm">
          <div style={{ padding: 10 }}>
            <Level2
              setBadges={setBadges}
              badges={badges}
              badgeName={"Finished:ch2:Beyond-the-Gate"}
              gotoNextLevel={gotoNextLevel}
              gotoPrevLevel={gotoPrevLevel}
            />
          </div>
        </Container>
          ,
    <Container style={{ float: "left", padding: 5 }} maxWidth="sm">
      <Level3
        setBadges={setBadges}
        badges={badges}
        badgeName={"Finished:ch3:Whole-New-World"}
        gotoNextLevel={gotoNextLevel}
        gotoPrevLevel={gotoPrevLevel}
      /></Container>,
  ];

  levels.push(
    <Container
      maxWidth="sm">
      <div style={{ padding: 10 }}>
        <LastLevel setBadges={setBadges} badges={badges} ><LevelTableOfContents levels={levels} setCurrentLevelNum={ setCurrentLevelNum }/></LastLevel>
      </div>
    </Container>

  )

  let currentLevel = levels[currentLevelNum - 1] 
 
  

  return (
    <>
      <Helmet>
        <title>CodeSpells Nexus</title>
        <meta name="description" content="Welcome to the Nexus! If you want to write and save spells that run on CodeSpells video games, you're in the right place." />
      </Helmet>
      <div onClick={(e) => {
        if (e.altKey) {
          setCurrentLevelNum(levels.length)
        }
      }}>
        {currentLevel}
      </div>
    </>
  );
}

export default LevelManager;
