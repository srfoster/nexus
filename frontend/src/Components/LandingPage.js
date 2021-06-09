import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import SpellsApiService from '../Services/spells-api-service';
import { Helmet } from "react-helmet";
import TokenService from '../Services/token-service';
import Level1 from "./NewUserFlow/Level1";
import Level2 from "./NewUserFlow/Level2";
import Level3 from "./NewUserFlow/Level3";
import LastLevel from "./NewUserFlow/LastLevel";

//Drafts...
import Level20 from "./NewUserFlow/Level20";
import Level57 from "./NewUserFlow/Level57";
import Level101 from "./NewUserFlow/Level101";

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

  let Secrets = [
    <Level20
      setBadges={props.setBadges}
      badges={props.badges}
      badgeName={"Finished:ch20:What-to-Call-This??"}
    />,
    <Level57
      setBadges={props.setBadges}
      badges={props.badges}
      badgeName={"Finished:ch57:??"}
    />,
    <Level101
      setBadges={props.setBadges}
      badges={props.badges}
      badgeName={"Finished:ch101:??"}
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
      <div onClick={(e) => {
        if (e.ctrlKey) {
          setShowSecrets(!showSecrets)
          console.log("SHOW SECRETS")
        }
      }}>
      {TokenService.hasAuthToken() ?
          (showSecrets ? <SecretLevels badges={badges} setBadges={ setBadges } /> : currentLevel) :
          < Level1 setBadges={setBadges} />
           
        }
      </div>
    </>
  );
}

export default LandingPage;