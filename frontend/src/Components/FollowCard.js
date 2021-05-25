import React from 'react';
import useStyles from '../styles.js';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import Tooltip from '@material-ui/core/Tooltip';

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar className={classes.followCardBody} position="static">
        <Toolbar>

          <Typography variant="h6" className={classes.menuButton}>
            News
          </Typography>
          <Tooltip className={classes.toolbar} title={`Remove test`}>
                      <IconButton aria-label="remove-mage">
                        <PersonAddDisabledIcon />
                      </IconButton>
                    </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  );
}
