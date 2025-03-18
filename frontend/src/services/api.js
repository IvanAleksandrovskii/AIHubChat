// services/api.js

import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000/api';
const API_BASE_URL = 'https://jy3dlw-ip-184-22-34-53.tunnelmole.net/api';

// Helper function to configure headers with Telegram initData
const configureHeaders = (initData) => {
    const headers = {};
    if (initData) {
        headers['X-Telegram-Web-App-Data'] = initData;
    }
    return { headers };
};

export async function fetchModels(initData) {
    try {
        const config = configureHeaders(initData);
        const response = await axios.get(`${API_BASE_URL}/models/`, config);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function sendMessage(content, modelId, initData) {
    try {
        const messageToSend = {
            content
            // You could add history context here if the API supports it
        };

        const config = configureHeaders(initData);
        // Add the model ID as a query parameter
        config.params = { ai_model_id: modelId };

        const response = await axios.post(
            `${API_BASE_URL}/message/`,
            messageToSend,
            config
        );
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
