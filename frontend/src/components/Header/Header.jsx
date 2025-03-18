// components/Header/Header.jsx

import React, { useState, useEffect, useRef } from 'react';
import './Header.css';


function Header({ selectedModel, availableModels, handleModelChange }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentModel = availableModels.find(model => model.id === selectedModel);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const selectModel = (modelId) => {
        handleModelChange({ target: { value: modelId } });
        setIsDropdownOpen(false);
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }

        return () => document.removeEventListener('click', handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <header>
            <div className="header-container">
                <h1 className="app-header">AI Chat</h1>

                <div className="model-indicator" onClick={toggleDropdown} ref={dropdownRef}>
                    <span className="current-model">
                        {currentModel ? currentModel.name : 'Выберите модель'}
                    </span>
                    <span className="dropdown-icon">{isDropdownOpen ? '▴' : '▾'}</span>

                    {isDropdownOpen && (
                        <div className="model-dropdown">
                            {availableModels.length === 0 ? (
                                <div className="model-option disabled">Loading models...</div>
                            ) : (
                                availableModels.map(model => (
                                    <div
                                        key={model.id}
                                        className={`model-option ${model.id === selectedModel ? 'selected' : ''}`}
                                        onClick={() => selectModel(model.id)}
                                    >
                                        {model.name}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
