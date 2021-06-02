import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import useStyles from '../../styles';

export const badgeWhitelist = ['getting-started']

export function badgeFilter(badgeName) {
  let boolean = badgeWhitelist.includes(badgeName)
  return  boolean
}

//Badge success popup
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function BadgeConfirmation(props) {
  const classes = useStyles;
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  let showAlert = badgeFilter(props.name) 

  return ( showAlert ? '' :
    <div className={classes.snackbarRoot}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      {/* severity setting/color: error/red, warning/orange, info/blue, succecss/green */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info">
          You conjured a badge! View your mage page for more details on it.
        </Alert>
      </Snackbar>
    </div>
  );
}