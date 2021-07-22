import React from 'react';
import './ChatBubble.css';

const ChatBubble = (props) => {
    return(
        <div className="bubble-container">
            <div className="img-circle"></div>
            <div className="talk-bubble round tri-right left-in">
                <div className="talk-text">{props.message}</div>
            </div>
        </div>
    )
};


export default ChatBubble;