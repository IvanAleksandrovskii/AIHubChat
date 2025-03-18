// components/Header/Header.jsx

import React from 'react';
import './Header.css';


function Header({ selectedModel, availableModels, handleModelChange, isLoading }) {
    // console.log("Header props:", { selectedModel, availableModels, handleModelChange, isLoading });
    
    return (
        <header className="app-header">
            <h1>AI Chat</h1>
            <div className="model-selector">
                <label htmlFor="model-select">Model:</label>
                <select
                    id="model-select"
                    value={selectedModel || ''}
                    onChange={handleModelChange}
                    disabled={isLoading || availableModels.length === 0}
                >
                    {availableModels.length === 0 ? (
                        <option value="">Loading models...</option>
                    ) : (
                        availableModels.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name} (Priority: {model.priority})
                            </option>
                        ))
                    )}
                </select>
            </div>
        </header>
    );
}

export default Header;
