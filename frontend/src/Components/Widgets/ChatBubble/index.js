import React from 'react';
import './ChatBubble.css';

const ChatBubble = (props) => {
    return(
        <div className="bubble-container">
            <div className="talk-bubble round tri-right left-in">
                <div className="talk-text">{props.message || props.children}</div>
            </div>
        </div>
    )
};

export default ChatBubble;