import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

// ---------------------
// SERVICES
// ---------------------
export const getLatestChecks = () => axios.get(`${API_BASE}/latest-checks/`);
export const getHistory = () => axios.get(`${API_BASE}/history/`);
export const getServiceDetails = (encodedUrl) =>
  axios.get(`${API_BASE}/details/${encodedUrl}/`);

// ---------------------
// CONNEXIONS INTERNET
// ---------------------
export const getConnectionsStatus = () =>
  axios.get(`${API_BASE}/connections/`);

export const createConnection = (payload) =>
  axios.post(`${API_BASE}/connections/`, payload);

export const updateConnection = (id, payload) =>
  axios.put(`${API_BASE}/connections/${id}/`, payload);

export const deleteConnection = (id) =>
  axios.delete(`${API_BASE}/connections/${id}/`);

// ---------------------
// AUTHENTIFICATION
// ---------------------
export const login = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login/`, {
      username,
      password,
    });
    return response.data; // contient access + refresh token
  } catch (error) {
    throw error.response?.data || { detail: "Identifiants incorrects" };
  }
};
