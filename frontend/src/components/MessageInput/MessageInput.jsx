// components/MessageInput/MessageInput.jsx

import React, { useRef, useEffect } from 'react';
import './MessageInput.css';

function MessageInput({ input, handleInputChange, handleSubmit, isLoading, selectedModel }) {
    const textareaRef = useRef(null);

    // Auto-resize textarea based on content
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
        }
    }, [input]);

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
                ref={textareaRef}
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
