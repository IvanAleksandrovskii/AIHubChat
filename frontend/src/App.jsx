import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch available AI models when component mounts
    fetchModels();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages change
    scrollToBottom();
  }, [messages]);

  const fetchModels = async () => {
    try {
      setError(null);
      const response = await axios.get('http://localhost:8000/api/models/');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setAvailableModels(response.data);
        setSelectedModel(response.data[0].id);
      } else {
        setError("No models were returned from the server");
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      setError(`Failed to fetch models: ${error.message || "Unknown error"}`);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Get last 5 messages for context (or fewer if there are less than 5)
      const recentMessages = [...messages.slice(-4), userMessage].filter(msg => msg.role === 'user' || msg.role === 'assistant');

      // Calculate total length of messages
      const totalLength = recentMessages.reduce((sum, msg) => sum + msg.content.length, 0);

      // Check if total length exceeds 10000 characters
      if (totalLength > 10000) {
        setIsLimitExceeded(true);
        // Remove oldest messages until under the limit
        let historyMessages = [...recentMessages];
        while (historyMessages.reduce((sum, msg) => sum + msg.content.length, 0) > 10000) {
          historyMessages.shift();
        }
        recentMessages.splice(0, recentMessages.length - historyMessages.length);
      } else {
        setIsLimitExceeded(false);
      }

      // Prepare the message for the API
      const messageToSend = {
        content: input,
        // You could add history context here if the API supports it
      };

      const response = await axios.post('http://localhost:8000/api/message/', messageToSend, {
        params: {
          ai_model_id: selectedModel
        }
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.content,
        timestamp: new Date().toISOString(),
        model: response.data.ai_model
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      setMessages(prevMessages => [...prevMessages, {
        role: 'system',
        content: `Error: ${error.response?.data?.detail || error.message || 'Could not send message. Please try again.'}`,
        timestamp: new Date().toISOString(),
        isError: true
      }]);

      setError(`Failed to send message: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
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

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <main className="chat-container">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome to AI Chat!</h2>
              <p>Send a message to start a conversation.</p>
              {availableModels.length === 0 && !error && (
                <p className="loading-models">Loading available AI models...</p>
              )}
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'} ${message.isError ? 'error-message' : ''}`}
              >
                <div className="message-header">
                  <span className="message-role">{message.role === 'user' ? 'You' : message.role === 'system' ? 'System' : 'AI'}</span>
                  {message.model && <span className="message-model">Model: {message.model}</span>}
                  <span className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {isLimitExceeded && (
          <div className="limit-warning">
            Message history exceeded 10,000 characters. Some older messages were removed from the context.
          </div>
        )}

        <form className="input-container" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim() || !selectedModel}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>

        <div className="history-info">
          <p>Keeping last 5 messages in memory. Maximum request size: 10,000 characters.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
