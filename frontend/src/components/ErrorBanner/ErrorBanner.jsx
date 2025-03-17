// components/ErrorBanner/ErrorBanner.jsx

import React from 'react';
import './ErrorBanner.css';


function ErrorBanner({ error, onClose }) {
    return (
        <div className="error-banner">
            {error}
            <button onClick={onClose}>✕</button>
        </div>
    );
}

export default ErrorBanner;
