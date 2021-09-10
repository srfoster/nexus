import { useState, useEffect, useRef, useCallback } from 'react';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ReactPlayer from 'react-player'
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
	gridItems: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	controlIcons: {
		color: "#777",
		fontSize: 50,
		transform: "scale(0.9)",
		"&:hover": {
			color: "#fff",
			transform: "scale(1)",
		},
	}
}))

function PlayerControls({ onPlayPause, playing, played, onSeek, onSeekMouseDown, onSeekMouseUp, elapsedTime, totalDuration }) {
  const classes = useStyles();

	return (<>
		<div style={{ paddingRight: 20 }}>
			<Grid container direction="row" spacing={4}>
				<Grid item xs={2}>
					<IconButton
						onClick={onPlayPause}
						className={classes.controlIcons}
						aria-label="play"
					>
						{playing ? (
							<PauseIcon fontSize="inherit" />
						) : (
							<PlayArrowIcon fontSize="inherit" />
						)}
					</IconButton>
				</Grid>
				<Grid item xs={8} className={classes.gridItems}>
					<PrettoSlider
						min={0}
						max={100}
						value={played * 100}
            valueLabelDisplay="on"
            valueLabelFormat={() => {
              return elapsedTime
            }}
						onChange={onSeek}
						onMouseDown={onSeekMouseDown}
						onChangeCommitted={onSeekMouseUp}
					/>
				</Grid>
				<Grid item xs={2} className={classes.gridItems}>
					<Typography style={{color: "white"}}>{elapsedTime}/{totalDuration}</Typography>
				</Grid>
			</Grid>
		</div>
	</>)
}

const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

function SimpleVideoPlayer(props) {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState('00:00')
  const [seeking, setSeeking] = useState(false)

  const format = (sec) => {
    if(isNaN(sec)){
      return '00:00'
    }

    const date = new Date(sec * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2,"0")
    if(hh){
      return `${hh}:${mm.toString().padStart(2,"0")}:${ss}`
    }

    return `${mm}:${ss}`
  }

  const handlePlayPause = useCallback(() => {
    setPlaying(!playing);
  })

  const handleProgress = useCallback((change) => {
    if(!seeking){
      setPlayed(change.played)
      setDuration(playerRef.current? playerRef.current.getDuration() : '00:00')
    }
  })

  const handleSeekChange = useCallback((e, newVal) => {
    setPlayed(parseFloat(newVal / 100))
  })

  const handleSeekMouseDown = useCallback((e) => {
    setSeeking(true)})

  const handleSeekMouseUp = useCallback((e, newVal) => {
    setSeeking(false) 
    playerRef.current.seekTo(newVal / 100)
  })

  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00'
  const elapsedTime = format(currentTime)
  const totalDuration = format(duration)

  return (
    <>
      <div style={{ backgroundColor: "black" }}>
        <ReactPlayer
          ref={playerRef}
          width={"100%"}
          url={props.videoUrl}
          controls={false}
          playing={playing}
          style={{}}
          progressInterval={100}
          onProgress={handleProgress}
          onEnded={() => {
            props.setVideoFinished(true)
          }}
        />
        <PlayerControls
          onPlayPause={handlePlayPause}
          playing={playing}
          played={played}
          onSeek={handleSeekChange}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
        />
      </div>
    </>
  )
}

export default SimpleVideoPlayer;