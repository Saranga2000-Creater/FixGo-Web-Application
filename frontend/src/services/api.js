// ============================================================
// frontend/src/services/api.js
// Central API service layer for FixGo.
//
// Usage:
//   import { api, UPLOADS_URL } from '../services/api';
//
//   // Authenticated requests (sends JWT automatically)
//   const data = await api.get('getServiceRequests.php');
//   const data = await api.post('updateStatus.php', { request_id: 1, new_status: 'Accepted' });
//
//   // Public requests (no token)
//   const data = await api.getPublic('getCategories.php');
//   const data = await api.postPublic('login.php', { email, password });
//
//   // Image assets
//   <img src={`${UPLOADS_URL}/${shop.thumbnail_url}`} />
// ============================================================

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

/** Root for uploaded file assets (shop images, profile photos, etc.) */
export const UPLOADS_URL = BASE_URL;

/** Full API base path */
const API_URL = `${BASE_URL}/api`;

// ── Internal helpers ──────────────────────────────────────

function getToken() {
    return localStorage.getItem('jwt_token') || '';
}

function authHeaders(isFormData = false) {
    const headers = {
        'Authorization': `Bearer ${getToken()}`,
    };
    if (!isFormData) headers['Content-Type'] = 'application/json';
    return headers;
}

function publicHeaders(isFormData = false) {
    const headers = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    return headers;
}

async function handleResponse(res) {
    let data;
    try {
        data = await res.json();
    } catch (e) {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return null; // Empty response
    }

    // Treat as error if HTTP status is bad, OR if the API explicitly sent success: false or an error key
    if (!res.ok || data?.success === false || data?.error) {
        const message = data?.message || data?.error || `Request failed with status ${res.status}`;
        const err = new Error(message);
        err.status = res.status;
        err.data = data;
        throw err;
    }
    return data;
}

// ── Public API object ─────────────────────────────────────

export const api = {
    /**
     * Authenticated GET — sends JWT token automatically.
     * @param {string} endpoint  e.g. 'getServiceRequests.php'
     * @param {Record<string,string>} [params]  URL query params
     */
    async get(endpoint, params = {}) {
        const url = new URL(`${API_URL}/${endpoint}`);
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: authHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * Authenticated POST — sends JWT token automatically.
     * @param {string} endpoint  e.g. 'updateStatus.php'
     * @param {object|FormData} body  JSON body or FormData
     */
    async post(endpoint, body = {}) {
        const isFormData = body instanceof FormData;
        const res = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: authHeaders(isFormData),
            body: isFormData ? body : JSON.stringify(body),
        });
        return handleResponse(res);
    },

    /**
     * Public GET — no token sent.
     * @param {string} endpoint  e.g. 'getCategories.php'
     * @param {Record<string,string>} [params]  URL query params
     */
    async getPublic(endpoint, params = {}) {
        const url = new URL(`${API_URL}/${endpoint}`);
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: publicHeaders(false),
        });
        return handleResponse(res);
    },

    /**
     * Public POST — no token sent.
     * @param {string} endpoint  e.g. 'login.php'
     * @param {object|FormData} body  JSON body or FormData
     */
    async postPublic(endpoint, body = {}) {
        const isFormData = body instanceof FormData;
        const res = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: publicHeaders(isFormData),
            body: isFormData ? body : JSON.stringify(body),
        });
        return handleResponse(res);
    },

    /**
     * Optional Auth GET — sends token if exists, otherwise acts public.
     * @param {string} endpoint 
     * @param {Record<string,string>} [params] 
     */
    async getOptionalAuth(endpoint, params = {}) {
        const url = new URL(`${API_URL}/${endpoint}`);
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
        const token = getToken();
        const headers = publicHeaders(false);
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(url.toString(), {
            method: 'GET',
            headers,
        });
        return handleResponse(res);
    },
};

export default api;
