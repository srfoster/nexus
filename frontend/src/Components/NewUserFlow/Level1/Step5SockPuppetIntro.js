import React, { useEffect, useState, useRef } from 'react';
import { MultipleChoiceQuestion } from '../../Widgets/Educational';
import { NewMessageNotification, SockPuppetChip, StudentChip, OpenedMessage } from '../../Widgets/NexusVoice';
import Typography from '@material-ui/core/Typography';

function Step5SockPuppetIntro(props) {
  const [messageOpened, setMessageOpened] = useState(false)
  const openedMessage = useRef(null);

  useEffect(() => {
    if (openedMessage.current)
      { openedMessage.current.scrollIntoView() }
  },[messageOpened])

  return (!messageOpened ? <NewMessageNotification
    nexusSays={"Wow!  New messages(s)..."}
    from={<SockPuppetChip level={1}></SockPuppetChip>}
    onOpenClicked={
      () => {
        setMessageOpened(true)
      }
    }
  /> :
    <div ref={openedMessage}>
      <OpenedMessage
        from={<SockPuppetChip level={1}/>}
        to={<StudentChip name={props.username} level={1} />}
        subject={"Video Introduction!"}
        videoUrl="https://d37uis87scphnk.cloudfront.net/NexusVideos/e-1.1-smaller.ogv"
        text={<SockPuppetVideoIntroText setCanContinue={props.setCanContinue} username={props.username} />}
      />
    </div>
  )
}


function SockPuppetVideoIntroText(props) {
  return (
    <>
      <Typography paragraph>Hi {props.username}!</Typography>
      <Typography paragraph>The Nexus just assigned me to be your Magic Teacher. I'm going to start making personalized videos and puzzles to help you learn magic!</Typography>
      <Typography paragraph>In the meantime, I'm attaching a silly personality quiz below.</Typography>
      <Typography paragraph>I wrote the questions and all the funny responses personally.  Please read all of them because the whole thing is supposed to buy me time to make your personalized video content.</Typography>
      <Typography paragraph>~Your Friend, Socky</Typography>
      <MultipleChoiceQuestion style={{ marginTop: 50 }}
        question="Do you think a sock can teach?"
        answers={[
          {
            correct: true, text: "Yes, if a sock can't teach something, it cannot be taught!",
            feedback: `Personality assessment result: User with name "${props.username}" is an optimist who likes socks.  User may continue.`
          },
          {
            correct: true, text: "Yes, socks can teach you what NOT to do.",
            feedback: `Personality assessment result: User with name "${props.username}" harbors mild anti-sock tendencies and should be monitored.  User may continue.`
          },
          {
            correct: true, text: "No, socks are inanimate objects.",
            feedback: `Personality assessment result: User with name "${props.username}" considers themselves to be superior to socks.  Recommended for sock sympathy training.  User may continue.`
          },
          {
            correct: true, text: "No, I do not trust socks!",
            feedback: `Personality assessment result: User with name "${props.username}" has had negative experiences with socks.  Recommended for sock exposure therapy.  User may continue.`
          },
          {
            correct: false, text: "These answers are too restrictive.",
            feedback: `Personality assessment result: User with name "${props.username}" is a narcisist who thinks their personality is too complex to be assessed by multiple-choice questions. User may not continue.`
          },
        ]}
        buttonText="Submit Answer"
        onCorrect={() => props.setCanContinue(true)}
        onIncorrect={() => props.setCanContinue(false)}
      />
    </>
  )
}

export default Step5SockPuppetIntro;