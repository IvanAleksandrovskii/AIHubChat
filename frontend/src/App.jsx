// src/App.jsx

import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import MessageList from './components/MessageList/MessageList';
import MessageInput from './components/MessageInput/MessageInput';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';
import TelegramWarning from './components/TelegramWarning/TelegramWarning';
import { useChat } from './hooks/useChat';
import './App.css';


function App() {
    const [isTelegramApp, setIsTelegramApp] = useState(false);
    const [tgInitData, setTgInitData] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize Telegram WebApp
    useEffect(() => {
        try {
            const tg = window?.Telegram?.WebApp;
            if (tg && tg.initData && tg.initData.length > 0) {
                // Only consider it a Telegram WebApp if initData exists
                tg.ready();
                setIsTelegramApp(true);
                setTgInitData(tg.initData);
                console.log("Telegram WebApp detected and initialized");
            } else {
                console.warn("Not inside Telegram WebApp environment");
                setIsTelegramApp(false);
            }
        } catch (error) {
            console.error("Error initializing Telegram WebApp:", error);
            setIsTelegramApp(false);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    const {
        messages,
        input,
        isLoading,
        selectedModel,
        availableModels,
        isLimitExceeded,
        error,
        messagesEndRef,
        handleInputChange,
        handleModelChange,
        handleSubmit,
        setError
    } = useChat(tgInitData);

    if (!isInitialized) {
        return <div className="loading">Initializing...</div>;
    }

    // Display a warning if not running inside Telegram
    if (!isTelegramApp && isInitialized) {
        console.log("Showing Telegram Warning");
        return <TelegramWarning />;
    }

    console.log("App state:", { isInitialized, isTelegramApp });

    return (
        <div className="app-container">
            <Header
                selectedModel={selectedModel}
                availableModels={availableModels}
                handleModelChange={handleModelChange}
                isLoading={isLoading}
            />
            {error && (
                <ErrorBanner
                    error={error}
                    onClose={() => setError(null)}
                />
            )}
            <main className="chat-container">
                <MessageList
                    messages={messages}
                    messagesEndRef={messagesEndRef}
                    isLimitExceeded={isLimitExceeded}
                    availableModels={availableModels}
                    isLoading={isLoading}
                />
                <MessageInput
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    selectedModel={selectedModel}
                />
                <div className="history-info">
                    <p>Keeping last 10 messages in memory. Maximum request size: 10,000 characters.</p>
                </div>
            </main>
        </div>
    );
}

export default App;
