import React, { useState } from 'react';
import { axiosInstance } from '../../apiConfig/axios';
import '../../styles/authStyles.css'; // Reuse existing styles

const ApiTestPage = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Helper to fetch CSRF token and extract XSRF-TOKEN
    const getCsrfToken = async () => {
        await axiosInstance.get('/sanctum/csrf-cookie');
        const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
        return token ? decodeURIComponent(token) : '';
    };

    // Generic API call handler
    const makeApiCall = async (method, url, data = null, isMultipart = false) => {
        setLoading(true);
        setResponse(null);
        setError(null);

        try {
        let headers = { 'Content-Type': 'application/json' };
        let payload = data;

        if (['post', 'patch', 'delete'].includes(method.toLowerCase())) {
            const token = await getCsrfToken();
            headers['X-XSRF-TOKEN'] = token;
            if (isMultipart) {
            headers['Content-Type'] = 'multipart/form-data';
            payload = new FormData();
            for (const key in data) {
                payload.append(key, data[key]);
            }
            }
        }

        const result = await axiosInstance({
            method,
            url,
            data: payload,
            headers,
        });

        setResponse(result.data);
        console.log(`Response from ${method} ${url}:`, result.data);
        } catch (err) {
        console.error(`Error from ${method} ${url}:`, err.response?.data || err.message);
        setError(err.response?.data?.message || 'Request failed');
        } finally {
        setLoading(false);
        }
    };

    // Test data for POST/PATCH requests
    const testData = {
        users: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
        user_type: 'student',
        },
        feedbacks: {
        content: 'Great club event!',
        rating: 5,
        },
        interviews: {
        application_id: 1,
        interviewer_id: 1,
        scheduled_at: '2025-06-01T10:00:00Z',
        },
        interview_slots: {
        interviewer_id: 1,
        start_time: '2025-06-01T09:00:00Z',
        end_time: '2025-06-01T10:00:00Z',
        },
        notifications: {
        user_id: 1,
        message: 'New interview scheduled',
        type: 'info',
        },
        profile: {
        phone_number: '+212987654321',
        bio: 'Updated bio via API test',
        branch: 'Mathematics',
        year_of_study: '2nd Year',
        },
    };

    return (
        <div className="auth-container">
        <div className="auth-content">
            <div className="auth-form-container">
            <h2>API Test Page</h2>
            <p className="subtitle">Test your Laravel API endpoints</p>

            {loading && <div className="status-message">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            {response && (
                <div className="status-message">
                <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Test Endpoint */}
                <button
                onClick={() => makeApiCall('get', '/test')}
                disabled={loading}
                style={buttonStyle}
                >
                Test /test (GET)
                </button>

                {/* User Endpoint */}
                <button
                onClick={() => makeApiCall('get', '/user')}
                disabled={loading}
                style={buttonStyle}
                >
                Get Current User (GET /user)
                </button>

                {/* Profile Endpoints */}
                <button
                onClick={() => makeApiCall('get', '/profile')}
                disabled={loading}
                style={buttonStyle}
                >
                Get Profile (GET /profile)
                </button>
                <button
                onClick={() => makeApiCall('patch', '/profile', testData.profile, true)}
                disabled={loading}
                style={buttonStyle}
                >
                Update Profile (PATCH /profile)
                </button>

                {/* Users Resource */}
                <button
                onClick={() => makeApiCall('get', '/users')}
                disabled={loading}
                style={buttonStyle}
                >
                List Users (GET /users)
                </button>
                <button
                onClick={() => makeApiCall('post', '/users', testData.users)}
                disabled={loading}
                style={buttonStyle}
                >
                Create User (POST /users)
                </button>
                <button
                onClick={() => makeApiCall('get', '/users/1')}
                disabled={loading}
                style={buttonStyle}
                >
                Get User ID 1 (GET /users/1)
                </button>
                <button
                onClick={() => makeApiCall('patch', '/users/1', testData.users)}
                disabled={loading}
                style={buttonStyle}
                >
                Update User ID 1 (PATCH /users/1)
                </button>
                <button
                onClick={() => makeApiCall('delete', '/users/1')}
                disabled={loading}
                style={buttonStyle}
                >
                Delete User ID 1 (DELETE /users/1)
                </button>

                {/* Feedbacks Resource */}
                <button
                onClick={() => makeApiCall('get', '/feedbacks')}
                disabled={loading}
                style={buttonStyle}
                >
                List Feedbacks (GET /feedbacks)
                </button>
                <button
                onClick={() => makeApiCall('post', '/feedbacks', testData.feedbacks)}
                disabled={loading}
                style={buttonStyle}
                >
                Create Feedback (POST /feedbacks)
                </button>

                {/* Interviews Resource */}
                <button
                onClick={() => makeApiCall('get', '/interviews')}
                disabled={loading}
                style={buttonStyle}
                >
                List Interviews (GET /interviews)
                </button>
                <button
                onClick={() => makeApiCall('post', '/interviews', testData.interviews)}
                disabled={loading}
                style={buttonStyle}
                >
                Create Interview (POST /interviews)
                </button>

                {/* Interview Slots Resource */}
                <button
                onClick={() => makeApiCall('get', '/interview-slots')}
                disabled={loading}
                style={buttonStyle}
                >
                List Interview Slots (GET /interview-slots)
                </button>
                <button
                onClick={() => makeApiCall('post', '/interview-slots', testData.interview_slots)}
                disabled={loading}
                style={buttonStyle}
                >
                Create Interview Slot (POST /interview-slots)
                </button>

                {/* Notifications Resource */}
                <button
                onClick={() => makeApiCall('get', '/notifications')}
                disabled={loading}
                style={buttonStyle}
                >
                List Notifications (GET /notifications)
                </button>
                <button
                onClick={() => makeApiCall('post', '/notifications', testData.notifications)}
                disabled={loading}
                style={buttonStyle}
                >
                Create Notification (POST /notifications)
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

// Simple button style
const buttonStyle = {
    padding: '10px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    };

export default ApiTestPage;