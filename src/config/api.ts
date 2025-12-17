// API configuration for InternTrack
// In production, VITE_API_URL should be set to your deployed backend URL

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4001/api";

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  applications: `${API_BASE_URL}/applications`,
  resumes: `${API_BASE_URL}/resumes`,
} as const;
