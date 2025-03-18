// hooks/useChat.js

import { useState, useEffect, useRef } from 'react';
import { fetchModels, sendMessage } from '../services/api';

export function useChat(tgInitData) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    const [availableModels, setAvailableModels] = useState([]);
    const [isLimitExceeded, setIsLimitExceeded] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (tgInitData) {
            loadModels();
        }
    }, [tgInitData]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadModels = async () => {
        try {
            setError(null);
            const models = await fetchModels(tgInitData);
            if (models?.length > 0) {
                setAvailableModels(models);
                setSelectedModel(models[0].id);
            } else {
                setError("No models were returned from the server");
            }
        } catch (err) {
            console.error('Error fetching models:', err);
            setError(`Failed to fetch models: ${err.message || "Unknown error"}`);
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date().toISOString()
        };
        // Add the new message to the history without truncation
        let updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);
        setError(null);
        // Prepare the context of the messages (the last 10 messages, not more than 10,000 characters)
        let recentMessages = updatedMessages.slice(-10);
        let totalLength = recentMessages.reduce((sum, msg) => sum + msg.content.length, 0);
        while (totalLength > 10000 && recentMessages.length > 1) {
            recentMessages.shift();
            totalLength = recentMessages.reduce((sum, msg) => sum + msg.content.length, 0);
        }
        setIsLimitExceeded(totalLength > 10000);
        try {
            console.log("Recent Messages sent to backend:", recentMessages);
            // Consert recentMessages into a JSON string and send it to the server
            const response = await sendMessage(JSON.stringify(recentMessages), selectedModel, tgInitData);
            const assistantMessage = {
                role: 'assistant',
                content: response.content,
                timestamp: new Date().toISOString(),
                model: response.ai_model
            };
            // Add the model message to the history
            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(`Failed to send message: ${err.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
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
    };
}
