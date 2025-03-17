// services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';


export async function fetchModels() {
    try {
        const response = await axios.get(`${API_BASE_URL}/models/`);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}


export async function sendMessage(content, modelId) {
    try {
        const messageToSend = {
            content
            // You could add history context here if the API supports it
        };

        const response = await axios.post(
            `${API_BASE_URL}/message/`,
            messageToSend,
            {
                params: {
                    ai_model_id: modelId
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
