// src/App.jsx

import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import MessageList from './components/MessageList/MessageList';
import MessageInput from './components/MessageInput/MessageInput';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';
import TelegramWarning from './components/TelegramWarning/TelegramWarning';
import { useChat } from './hooks/useChat';
import './App.css';


// TODO: Add fullscren mode
function App() {
    const [isTelegramApp, setIsTelegramApp] = useState(false);
    const [tgInitData, setTgInitData] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Telegram WebApp initialization
    useEffect(() => {
        try {
            const tg = window?.Telegram?.WebApp;
            if (tg && tg.initData && tg.initData.length > 0) {
                tg.ready();
                setIsTelegramApp(true);
                setTgInitData(tg.initData);
            } else {
                setIsTelegramApp(false);
            }
        } catch (error) {
            console.error("Error initializing Telegram WebApp:", error);
            setIsTelegramApp(false);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // TODO: Still got doubds about this keyboard height fix -> doublecheck
    useEffect(() => {
        const updateHeight = () => {
            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            const fullHeight = document.documentElement.clientHeight;
            const heightDiff = fullHeight - viewportHeight;
            setKeyboardHeight(heightDiff > 100 ? Math.min(heightDiff, 100) : 0); // Max limit for height update
        };

        window.visualViewport?.addEventListener("resize", updateHeight);
        window.addEventListener("resize", updateHeight);

        return () => {
            window.visualViewport?.removeEventListener("resize", updateHeight);
            window.removeEventListener("resize", updateHeight);
        };
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

    if (!isTelegramApp && isInitialized) {
        return <TelegramWarning />;
    }

    return (
        <div className="app-container" style={{ paddingBottom: keyboardHeight }}>
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
