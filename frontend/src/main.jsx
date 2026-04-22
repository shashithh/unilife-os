import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Override fetch to automatically attach JWT token and normalize URLs for local API calls
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
    let normalizedUrl = url;
    if (typeof url === 'string') {
        normalizedUrl = url.replace('http://localhost:5000/api', '/api');
    }
    
    if (typeof normalizedUrl === 'string' && normalizedUrl.startsWith('/api')) {
        const token = localStorage.getItem('token');
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }
    }
    return originalFetch(normalizedUrl, options);
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);