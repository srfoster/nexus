import React, { useEffect, useState, useRef } from 'react';
import { useLocalStorage, spread } from "../../Util";
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { ContinueButton } from './Level';
import { Level } from './Level';
import { NewMessageNotification, OpenedMessage, NexusDevsChip, StudentChip } from '../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';

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
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e3.mp4"
        text={
          <>
            <Typography paragraph>
              Thanks so much for playing our game so far! We are still working on it, but if you'd like to support the project, here are some options: 
            </Typography>
            <Typography paragraph>
              Links  
            </Typography>
            <Typography paragraph>
            
            </Typography>
          </>
        }
      />
    </div>
  )
}

function LastLevel(props) {
  const [currentPart, setCurrentPart] = useLocalStorage("lvl11:currentPart", 0)
  const [canContinue, setCanContinue] = useState(false)

  //Arbitrarily decided this was Level 11
  return (
    <>
      <Level number={11} subtitle={"To Be Continued..."}>
        <CardContent>
          <LastLevelContent />
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