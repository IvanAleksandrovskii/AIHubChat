// components/MessageList/MessageList.jsx

import React from 'react';
import Message from '../Message/Message';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import './MessageList.css';


function MessageList({
    messages,
    messagesEndRef,
    isLimitExceeded,
    availableModels,
    isLoading
}) {
    return (
        <div className="message-list">
            {messages.length === 0 && (
                <div className="welcome-message">
                    <h2>Welcome to AI Chat</h2>
                    <p>Select a model and start chatting!</p>
                    <p>Available models: {availableModels.map(model => model.name).join(', ')}</p>
                </div>
            )}

            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}

            {isLoading && <TypingIndicator isVisible={true} />}

            {isLimitExceeded && (
                <div className="warning-banner">
                    Warning: Message history exceeds 10,000 characters.
                    Some context may be lost.
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;
