import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import SpellsApiService from '../Services/spells-api-service';
import { Helmet } from "react-helmet";
import TokenService from '../Services/token-service';
import Level1 from "./NewUserFlow/Level1";
import Level2 from "./NewUserFlow/Level2";
import Level3 from "./NewUserFlow/Level3";
import Level4 from "./NewUserFlow/Level4";
import Level5 from "./NewUserFlow/Level5";
import Level6 from "./NewUserFlow/Level6";
import Level7 from "./NewUserFlow/Level7";
import Level8 from "./NewUserFlow/Level8";
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


const LandingPage = (props) => {
  const [hasFetchedBadges, setHasFetchedBadges] = useState(false);
  const [badges, setBadges] = useState(undefined);

  const levels = [
    <Level2
      setBadges={setBadges}
      badges={badges}
      badgeName={"Finished:ch2:Beyond-the-Gate"}
    />,
    <Level3
      setBadges={setBadges}
      badges={badges}
      badgeName={"Finished:ch3:Light-Mage-or-Dark-Mage"}
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

  let currentLevel = undefined;
  if (hasFetchedBadges && badges !== undefined && badges.length !== undefined) {
    currentLevel = levels[currentLevelNum(badges) - 2];
  }
  
  return (
    <>
      <Helmet>
        <title>CodeSpells Nexus</title>
        <meta name="description" content="Welcome to the Nexus! If you want to write and save spells that run on CodeSpells video games, you're in the right place." />
      </Helmet>
      {TokenService.hasAuthToken() ?
        currentLevel :
        <Level1 setBadges={ setBadges } />
      }
    </>
  );
}

export default LandingPage;