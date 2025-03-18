// components/MessageInput/MessageInput.jsx

import React from 'react';
import './MessageInput.css';

function MessageInput({ input, handleInputChange, handleSubmit, isLoading, selectedModel }) {
    const handleKeyDown = (e) => {
        // Submit on Enter without Shift key
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && selectedModel && !isLoading) {
                handleSubmit(e);
            }
        }
        // Shift+Enter allows for new line (default textarea behavior)
    };

    return (
        <form className="input-container" onSubmit={handleSubmit}>
            <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
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
