import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Snackbar from '@material-ui/core/Snackbar';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import AddBadgeOnRender from '../Badges/AddBadgeOnRender';

const Level = (props) => {
  return (
    <>
      <Card>
        <CardHeader title={"Level " + props.number + ""}
          subheader={props.subtitle}>
        </CardHeader>
        <CardContent>
          {props.children}
        </CardContent>
      </Card>
    </>
  );
}

const ShowAfter = (props) => {
  const [shown, setShown] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true

    Object.keys(props.seconds).map((k) => {
      setTimeout(() => {
        let value = props.seconds[k];
        if (mounted) {
          setShown(true);
          setMessage(value);
        }
      },
        k * 1000);
    })

    return () => {
      mounted = false
    }
  }, []);

  function GrowTransition(props) {
    return <Grow {...props} />;
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={shown}
      TransitionComponent={GrowTransition}>
      <Alert severity="info">{message}</Alert>
    </Snackbar>
  );
}

const HintButton = (props) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <>
      <p>
        <Button
          onClick={() => setShowHint(true)}>Hint</Button>
        {showHint ? props.hint : ""}</p>
    </>
  );
}

const ContinueButton = (props) => {
    const [levelComplete, setLevelComplete] = useState(false)

    return <>
        <Button onClick={() => {
            setLevelComplete(true);
            props.onComplete()
        }}>Continue</Button>
        { levelComplete ? <AddBadgeOnRender name={props.badgeName} /> : ""}
    </>
}


export { Level, HintButton, ShowAfter, ContinueButton };