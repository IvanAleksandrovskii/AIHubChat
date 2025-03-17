import React from 'react';
import Header from './components/Header/Header';
import MessageList from './components/MessageList/MessageList';
import MessageInput from './components/MessageInput/MessageInput';
import ErrorBanner from './components/ErrorBanner/ErrorBanner';
import { useChat } from './hooks/useChat';
import './App.css';

function App() {
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
    } = useChat();

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
                    error={error}
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