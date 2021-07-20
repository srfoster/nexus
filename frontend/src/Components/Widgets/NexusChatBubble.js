import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    container: {
        bottom: 0,
    },
    bubbleContainer: {
        width: '100%'
    },
    bubble: {
        padding: '3% 5% 3% 5%',
        color: "black",
        margin: '20px',
        display: 'inline-block',
        position: 'relative',
        width: '400px',
        height: 'auto',
        backgroundColor: 'lightyellow',
        borderRadius: '30px',
    },
    triRightLeftTop: {
        '&::after': {
            position: 'absolute',
            width: 0,
            height: 0,
            left: -20,
            right: 'auto',
            top: 0,
            bottom: 'auto',
            border: '22px solid',
            borderColor: 'lightyellow transparent transparent transparent',
            content: ' ' //whitespace doesn't end up in webpage
            // when I add content with whitespace back in it works
        }
    }
}));

const ChatLayout = () => {
    const classes = useStyles();
    const dummyData = [
        {
            message: 'I am the Nexus',
            direction: 'left'
        },
        {
            message: 'I am using chat bubbles now.',
            direction: 'left'
        }
    ];

    const chatBubbles = dummyData.map((obj, i = 0) => (
        <div className={classes.bubbleContainer}>
            <div key={i++} className={clsx(classes.bubble, classes.triRightLeftTop)}>
                <div className={classes.button}>{obj.message}</div>
            </div>
        </div>
    ));
    return <div className={classes.container}>{chatBubbles}</div>;
};

export default ChatLayout;