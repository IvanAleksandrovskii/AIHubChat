// components/TypingIndicator/TypingIndicator.jsx

import React from 'react';
import './TypingIndicator.css';


function TypingIndicator({ isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="typing-indicator">
            <div className="typing-text">Typing</div>
            <div className="typing-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
        </div>
    );
}

export default TypingIndicator;
