import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import SpellsApiService from '../Services/spells-api-service';
import { Helmet } from "react-helmet";
import TokenService from '../Services/token-service';
import Container from '@material-ui/core/Container';

import Level1 from "./NewUserFlow/Level1/"
import Level2 from "./NewUserFlow/Level2";
import Level3 from "./NewUserFlow/Level3";
import Level4 from "./NewUserFlow/Level4";
import Level5 from "./NewUserFlow/Level5";
import Level6 from "./NewUserFlow/Level6";
import Level7 from "./NewUserFlow/Level7";
import Level8 from "./NewUserFlow/Level8";
import LastLevel from "./NewUserFlow/LastLevel";


//Drafts...
import Level20 from "./NewUserFlow/Level20";
import Level57 from "./NewUserFlow/Level57";
//import Level101 from "./NewUserFlow/Level101";

import { useLocalStorage } from "../Util";

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

function SecretLevels(props) {
  //const [selection, setSelection] = useState(0)
  console.log('landingpage:', props)
  let Secrets = [
    <Level20
      setBadges={props.setBadges}
      badges={props.badges}
      badgeName={"Finished:ch20:Terminal Button anyone?"}
    />,
    <Level57
      setBadges={props.setBadges}
      badges={props.badges}
      badgeName={"Finished:ch57:??"}
      darkMode={props.darkMode}
      setDarkMode={props.setDarkMode}
    />,
  ]

  return <>
    <h2>Secret Levels</h2>
    {Secrets}
  </>
}


const LandingPage = (props) => {
  const [hasFetchedBadges, setHasFetchedBadges] = useState(false);
  const [badges, setBadges] = useState(undefined);
  const [showSecrets, setShowSecrets] = useState(undefined);
  const [currentLevelNum, setCurrentLevelNum] = useLocalStorage("current-level-num", 1);

  const gotoNextLevel = () => {
    setCurrentLevelNum(currentLevelNum + 1)
  }

  const gotoPrevLevel = () => {
    setCurrentLevelNum(currentLevelNum - 1)
  }

  const levels = [
    <Level1
      dummy="dummy"
      setBadges={setBadges}
      badges={badges}
      badgeName={"Finished:ch1:Introduction"}
      gotoNextLevel={ gotoNextLevel }
      gotoPrevLevel={ gotoPrevLevel }
    />,
    <Level2
      setBadges={setBadges}
      badges={badges}
      badgeName={"Finished:ch2:Beyond-the-Gate"}
      gotoNextLevel={ gotoNextLevel }
      gotoPrevLevel={ gotoPrevLevel }
    />,
    <Level3
      setBadges={setBadges}
      badges={badges}
      badgeName={"Finished:ch3:Light-Mage-or-Dark-Mage"}
      gotoNextLevel={ gotoNextLevel }
    />,
    <Level4
      setBadges={setBadges}
      badges={badges}
      badgeName={"Finished:ch4:TBD"}
    />,
    <Level5
      setBadges={setBadges}
      badges={badges}
      badgeName={"Finished:ch5:TBD"}
    />,
    <Level6
      setBadges={setBadges}
      badges={badges}
      badgeName={"Finished:ch6:TBD"}
    />,
    <Level7
      setBadges={setBadges}
      badges={badges}
      badgeName={"Finished:ch7:TBD"}
    />,
    <Level8
      setBadges={setBadges}
      badges={badges}
      badgeName={"Finished:ch8:TBD"}
    />,
    <LastLevel setBadges={ setBadges } badges={ badges }/>
  ];

  useEffect(() => {
    SpellsApiService.getBadgesByUser("me")
      .then(badges => {
        setHasFetchedBadges(true);
        setBadges(badges);
      })
  }, [])

  /*
  let currentLevel = undefined;
  if (hasFetchedBadges && badges !== undefined && badges.length !== undefined) {
    currentLevel = levels[currentLevelNum(badges) - 2];
  }
  */

  let currentLevel = levels[currentLevelNum - 1] 
  
  return (
    <>
      <Helmet>
        <title>CodeSpells Nexus</title>
        <meta name="description" content="Welcome to the Nexus! If you want to write and save spells that run on CodeSpells video games, you're in the right place." />
      </Helmet>
      <Container
        maxWidth="sm">
        <div style={{padding: 10}}>
          <div onClick={(e) => {
            if (e.ctrlKey || e.metaKey) {
              setShowSecrets(!showSecrets)
            }
          }}>
            { (showSecrets ?
                <SecretLevels badges={badges} setBadges={setBadges} /> :
                currentLevel) }
          </div>
        </div>
      </Container>
    </>
  );
}

export default LandingPage;