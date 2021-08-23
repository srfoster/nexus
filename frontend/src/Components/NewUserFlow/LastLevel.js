import React, { useEffect, useState, useRef } from 'react';
import { useLocalStorage, spread } from "../../Util";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { ContinueButton } from './Level';
import { Level } from './Level';
import { NewMessageNotification, OpenedMessage, NexusDevsChip, StudentChip } from '../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';

function CustomButtonGroup(props) {
  return (
    <ButtonGroup color="secondary" aria-label="outlined primary button group" style={{ paddingBottom: 20 }}>
      {props.children.map(e=><Button href={e.link}>{e.name}</Button>)}
    </ButtonGroup>
  )
}

function LastLevelContent(props) {
  const openedMessage = useRef(null);
  var [messageOpened, setMessageOpened] = useLocalStorage("sock-puppet-last-lesson", false)
  
  return (!messageOpened ? <NewMessageNotification
    nexusSays={"Wow!  New messages(s)..."}
    from={<NexusDevsChip></NexusDevsChip>}
    onOpenClicked={
      () => {
        setMessageOpened(true)
      }
    }
  /> :
    <div ref={openedMessage}>
      <OpenedMessage
        from={<NexusDevsChip />}
        to={<StudentChip name={props.username} level={1} />}
        subject={"The End of the Line... So Far"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e-behind-the-green-screen-with-cta.ogv"
        text={
          <>
              <Typography paragraph>
                Thanks so much for playing our game so far! We are still working on it, but if you'd like to support the project, here are some options:
              </Typography>
            <div style={{textAlign: 'center'}}>
              <Typography variant="h6">
                Share the Project!
              </Typography>
              <CustomButtonGroup>{[  //update social links to start a new post
                {
                  name: "Facebook",
                  link: "https://www.facebook.com"
                },
                {
                  name: "Twitter",
                  link: "https://www.twitter.com"
                },
                {
                  name: "Instagram",
                  link: "https://www.instagram.com"
                }
              ]}</CustomButtonGroup>
              <Typography variant="h6">
                Help Fund the Project!
              </Typography>
              <CustomButtonGroup>{[
                {
                  name: "Patreon",
                  link: "https://patreon.com/codespells"
                },
                {
                  name: "Buy Our Book",
                  link: "https://amzn.to/3lGjrQ5" 
                },
                {
                  name: "Buy CodeSpells Merch",
                  link: "" //Create merch link
                }
              ]}</CustomButtonGroup>
              <Typography variant="h6">
                Help Contribute to the Project!
              </Typography>
              <CustomButtonGroup>{[
                {
                  name: "Create Learning Resources",
                  link: "" //need link to instructions for how to create/submit
                },
                {
                  name: "Contribute to Codebase",
                  link: ""
                },
              ]}</CustomButtonGroup>
            </div>
          </>
        }
      />
    </div>
  )
}

function LastLevel(props) {
  const [currentPart, setCurrentPart] = useLocalStorage("lvl11:currentPart", 0)
  const [canContinue, setCanContinue] = useState(false)

  return (
    <>
      <Level number={99} subtitle={"To Be Continued..."}>
        <CardContent>
          <LastLevelContent />
          <Card>
            <CardContent>
              <Typography variant="h6">Table of Contents</Typography>
              {props.children}
            </CardContent>
          </Card>
        </CardContent>
        <CardActions>
          <Button key="back-button"
            onClick={() => {
              if (currentPart == 0) {
                props.gotoPrevLevel()
              } else {
                setCurrentPart(currentPart - 1);
                setCanContinue(false);
              }
            }}>Back</Button>
          <ContinueButton onClick={() => setCurrentPart(currentPart + 1)} />
        </CardActions>
      </Level>
    </>
  )
}

export default LastLevel;