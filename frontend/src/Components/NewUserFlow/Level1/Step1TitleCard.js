import React, { useEffect, useState } from 'react';
import Alert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { ContinueButton } from "../Level";
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';

function Step1TitleCard({ setTitleScreenComplete }) {
	let [step, setStep] = useState(0);

	let os_name = "Not known";
	if (navigator.appVersion.indexOf("Win") != -1)
		os_name = "Windows OS";
	if (navigator.appVersion.indexOf("Mac") != -1)
		os_name = "MacOS";
	if (navigator.appVersion.indexOf("X11") != -1)
		os_name = "UNIX OS";
	if (navigator.appVersion.indexOf("Linux") != -1)
		os_name = "Linux OS";

	useEffect(() => {
		setTimeout(() => setStep(1), 2000)
		setTimeout(() => setStep(2), 4000)
	}, [])

	return (
		<Card style={{ margin: 0, position: "absolute", top: "50%", left: "50%", msTransform: "translate(-50%,-50%)", transform: "translate(-50%,-50%)" }}>
			<CardContent>
				<Fade in={true} timeout={1000}>
					<div style={{ textAlign: "center", padding: "20px 40px 20px 40px" }}>
						<Typography variant="h1" style={{ fontSize: 25 }}>
							CodeSpells: The Nexus
						</Typography>
						<br />
						<Typography variant="h2" style={{ fontSize: 16 }}>
							A Text Adventure about the Magic of Coding
						</Typography>
					</div>
				</Fade>
			</CardContent>
			<CardActions>
				{os_name == "Windows OS" ?
					<Alert severity="error" style={{ visibility: "hidden" }}>Warning: This game is currently only compatible with <br />Windows OS. On other operating systems, you won't be <br />able to proceed beyond Level 2. Proceed with caution.</Alert> :
					<Alert severity="error">Warning: This game is currently only compatible with <br />Windows OS. On your operating system, you won't be <br />able to proceed beyond Level 2. Proceed with caution.</Alert>
				}
				{step < 1 ? //This hidden button trick is a bit gross.  
					// Makes sure the button is there to force the container
					// to have a particular height.  Then we render a new (not hidden) button
					// so it Fades in nicely....  TODO: Do this more idiomatically.
					// Wish someone would come along and fix this.  -The Devs of the Nexus...
					<ContinueButton key="hidden-next-button" style={{ visibility: "hidden" }}
						onClick={() => setTitleScreenComplete(true)} /> :
					<ContinueButton key="unhidden-next-button"
						onClick={() => setTitleScreenComplete(true)} />
				}
			</CardActions>
			<img src="https://code.org/api/hour/begin_codespells_nexus.png" style={{visibility: "hidden", width: 1, height: 1}}/>
		</Card>
	)
}

export default Step1TitleCard;