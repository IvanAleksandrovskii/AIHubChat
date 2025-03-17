// components/MessageInput/MessageInput.jsx

import React from 'react';
import './MessageInput.css';


function MessageInput({ input, handleInputChange, handleSubmit, isLoading, selectedModel }) {
    return (
        <form className="input-container" onSubmit={handleSubmit}>
            <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message..."
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !input.trim() || !selectedModel}
            >
                {isLoading ? 'Sending...' : 'Send'}
            </button>
        </form>
    );
}

export default MessageInput;
