// components/TelegramWarning/TelegramWarning.js

import React from 'react';
import './TelegramWarning.css';


const TelegramWarning = () => {
    return (
        <div className="telegram-warning">
            <div className="telegram-warning-content">
                <div className="telegram-logo">
                    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
                        <path d="M66.964 134.874s-32.08-10.062-51.344-16.002c-17.542-6.693-1.57-14.928 6.015-17.59 7.585-2.66 186.38-71.948 186.38-71.948s23.403-8.354 19.86 6.015c0 0-3.543 3.543-7.085 10.062l-32.08 98.561s-2.66 9.17-18.502 9.17c-10.062 0-14.928-8.355-16.002-14.928-.534-4.077-10.062-34.74-14.927-50.742" fill="rgb(0, 136, 204)" />
                        <path d="M98.166 135.938s-4.55-3.543-10.428-11.897c-5.878-8.355-26.065-34.742-26.065-34.742l81.665-51.38s7.086-4.55 6.015 0c0 0-1.538 1.57-3.543 4.55-2.005 2.982-42.092 37.848-42.092 37.848" fill="rgb(217, 232, 242)" />
                        <path d="M102.88 146.667l-4.55-39.292s-1.537-12.43 10.63-3.542c12.166 8.888 30.04 21.83 30.04 21.83" fill="rgb(180, 216, 239)" />
                    </svg>
                </div>
                <h1>Open in Telegram</h1>
                <p>This app is designed to work only within the Telegram messenger.</p>
                <p>Please open this application directly from Telegram.</p>
                <a
                    href="https://t.me/"
                    className="telegram-button"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open Telegram
                </a>
            </div>
        </div>
    );
};

export default TelegramWarning;
