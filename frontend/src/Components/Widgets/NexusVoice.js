import { useState, useEffect } from 'react';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import SchoolIcon from '@material-ui/icons/School';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Sound from 'react-sound';

export function NewMessageNotification(props) {
  return(<Grid container spacing={1}>
    <Fade in={true} timeout={1000}>
      <Grid item xs={6}>
        <Typography>
          {props.nexusSays}
        </Typography>
      </Grid>
    </Fade>
    <Fade in={true} timeout={2000}>
      <Grid item xs={6}>
        <Gong />
        <Badge badgeContent={1} color="secondary">
          <MailIcon />
        </Badge>
        <Typography>from</Typography>
        {props.from}
        <Button size="small" onClick={ ()=>props.onOpenClicked() }>Open?</Button>
      </Grid>
    </Fade>
  </Grid>)
}

export function Gong(){
  return <Sound
    url="/gong.mp3"
    playStatus={Sound.status.PLAYING}
    playFromPosition={0 /* in milliseconds */}
  />
}


export function SockPuppetChip() {
  return <Chip avatar={<Avatar alt="Sock Puppet"><SchoolIcon/></Avatar>} label="Sock Puppet (Teacher Lvl 1)"></Chip>

}

export function StudentChip(props) {
  return <Chip avatar={<Avatar alt={props.name}/>} label={<span>{props.name} {" (Student Lvl " + (props.level !== undefined ? props.level : 10 * props.name.length) + ")"}</span>}></Chip>
}

export function FakeChip(props) {
  return <Chip avatar={<Avatar alt={props.name}/>} label={<span>{props.name} {" (Lvl " + (props.level !== undefined ? props.level : 10 * props.name.length) + ")"}</span>}></Chip>
}
 
export function SpinThen(props) {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setTimeout(() => { setShowFeedback(true) } ,props.spinTime)
  }, [])

  return (
    <>
      {showFeedback ? props.children : <CircularProgress></CircularProgress>}
    </>
  );
}
