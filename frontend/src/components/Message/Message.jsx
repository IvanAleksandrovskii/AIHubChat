// components/Message/Message.jsx

import React from 'react';
import './Message.css';


function Message({ message }) {
    return (
        <div
            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'} ${message.isError ? 'error-message' : ''}`}
        >
            <div className="message-header">
                <span className="message-role">
                    {message.role === 'user' ? 'You' : message.role === 'system' ? 'System' : 'AI'}
                </span>
                {message.model && <span className="message-model">Model: {message.model}</span>}
                <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                </span>
            </div>
            <div className="message-content">
                {message.content}
            </div>
        </div>
    );
}

export default Message;
