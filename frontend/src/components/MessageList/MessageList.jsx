// components/MessageList/MessageList.jsx

import React from 'react';

import Message from '../Message/Message';
import './MessageList.css';


function MessageList({ messages, messagesEndRef, isLimitExceeded, availableModels, error }) {
    return (
        <div className="messages-container">
            {messages.length === 0 ? (
                <div className="welcome-message">
                    <h2>Welcome to AI Chat!</h2>
                    <p>Send a message to start a conversation.</p>
                    {availableModels.length === 0 && !error && (
                        <p className="loading-models">Loading available AI models...</p>
                    )}
                </div>
            ) : (
                messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))
            )}
            <div ref={messagesEndRef} />

            {isLimitExceeded && (
                <div className="limit-warning">
                    Message history exceeded 10,000 characters. Some older messages were removed from the context.
                </div>
            )}
        </div>
    );
}


export default MessageList;