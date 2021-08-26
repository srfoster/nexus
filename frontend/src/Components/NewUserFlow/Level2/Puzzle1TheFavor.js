import React, { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from "../../../Util";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChatBubble from '../../Widgets/ChatBubble/';
import { NewMessageNotification, OpenedMessage, PleaseWaitWhileSockPuppetCreatesContent, SockPuppetChip, StudentChip } from '../../Widgets/NexusVoice';
import SockPuppetFavorInInventory from './SockPuppetFavorInInventory';
import Terminal from 'react-console-emulator'
import Typography from '@material-ui/core/Typography';

//VIDEO SCRIPT
// Thanking
// Explaining what Nexus is

/*
Thank you so much!  Since I've been working for the Nexus,
I've only had a few students get past the first puzzle!

  [Corkboard: kenzo, jess, thefastsnake, woogachaka,  laurond, jonpi, trithir]
 
I'm going to do my best to make these coding experiences as fun as I can! 
Oh shoot. I called it coding! I meant spellcrafting! 

Ok, lemme tell you how things work here at the Nexus...
As you may have noticed, you're inside of a puzzle game. But it's also supposed
to be an educational experience to learn coding. But we don't call it coding around here.
We call it *magic*. I don't really know why.

All I know is, the Nexus gives me learning objectives and I'm supposed to make
personalized educational videos and puzzles just for you.  For example, right now,
the Nexus says that after this puzzle you're supposed to know about how terminals
work here in the Nexus. 

But instead of giving a boring lecture about terminals, I'm going to give you a shortcut. 
Any time you find a terminal in the Nexus, you can just type "help."  The terminal
will tell you what else you can type.

Oh, and don't worry.  I haven't forgotten about the fact that I owe you a favor.
You'll see.  Try the puzzle below.

*/

const SockPuppetsMessage = (props) => {
  const [messageOpened, setMessageOpened] = useState(false)
  const openedMessage = useRef(null);
  let [username, setUsername] = useLocalStorage("user-name", undefined);

  useEffect(() => {
    if (openedMessage.current)
      { openedMessage.current.scrollIntoView() }
  },[messageOpened])

  return (!messageOpened ? <NewMessageNotification
    nexusSays={"Wow!  New messages(s)..."}
    from={<SockPuppetChip level={2}></SockPuppetChip>}
    onOpenClicked={
      () => {
        setMessageOpened(true)
      }
    }
  /> :
    <div ref={openedMessage}>
      <OpenedMessage
        from={<SockPuppetChip level={2}/>}
        to={<StudentChip name={username} level={2} />}
        subject={"The Favor I Owe"}
        videoUrl="https://codespells-org.s3.amazonaws.com/NexusVideos/e-2.1-smaller.ogv"
        text={
          <>
            <Typography paragraph>
              As I said in the video, just type <tt>help</tt> in the terminal below...
          </Typography>
            <Typography paragraph>
              I've put my favor in your inventory.  Go find it!
          </Typography>
            <Typography paragraph>
              ~Your Friend, Socky
          </Typography>
            <Terminal
              commands={{
                inventory: {
                  description: 'Display your inventory.',
                  usage: '',
                  fn: function () {
                    return <SockPuppetFavorInInventory
                      onOpen={ () => props.setCanContinue(true) }/>
                  }
                },
              }}
              welcomeMessage={''}
              promptLabel={'mage@Nexus:~$'}
              autoFocus={true}
            />
          </>
        }
      />
    </div>
  )
}

function Puzzle1TheFavor(props) {
  var [messageOpened, setMessageOpened] = useLocalStorage("level-2-puzzle-1-message-opened", false)

  return (
    <PleaseWaitWhileSockPuppetCreatesContent
      contentComplete={messageOpened}
      setContentComplete={setMessageOpened}
      NexusStallingMessages={[
        <span><SockPuppetChip level={2}/> is making video content!</span>,
        {
          text: <ChatBubble>Because Sock Puppet has been slower than average, my entertainment algorithms have been activated.</ChatBubble>,
        },
        { text: <ChatBubble>Here's a fun fact!</ChatBubble>,
        },
        
        {
          text: <Card style={{marginTop: 20, marginBottom:20}}>
            <CardContent>
              <Typography
                color="textSecondary" gutterBottom
              >Did you know...</Typography>

              ...I (the Nexus) was built by two eccentric thousandaires during the COVID-19 lockdown of the year 2020?
            </CardContent>
          </Card>,
        },
        {
          text: <span><SockPuppetChip  level={2}/> is <strong>still</strong> making video content...<br/><br/></span>,
        },
        {
          text: <ChatBubble>Here's another fact!</ChatBubble>,
        },
        {
          text: <Card style={{marginTop: 20, marginBottom:20}}>
            <CardContent>
              <Typography
                color="textSecondary" gutterBottom
              >Did you know...</Typography>

              ...the Nexus's software architects have not been seen since the year 2062?
            </CardContent>
          </Card>,
        },
        {
          text: <span><SockPuppetChip level={2} /> is <strong>still</strong> making video content...<br/><br/></span>,
        },
        {
          text: <ChatBubble>Here's another fact!</ChatBubble>,
        },
        {
          text: <ChatBubble>Ahh.  Never mind.  <SockPuppetChip level={2} /> is <strong>finally</strong> finished.</ChatBubble>,
        },
      ]}
      SockPuppetMessage={<SockPuppetsMessage setCanContinue={ props.setCanContinue } /> /*<SockPuppetsMessage {...props} />*/}
    />
  )
}

export default Puzzle1TheFavor;