import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

if (!API_BASE_URL) {
  console.error("Error: REACT_APP_API_URL is not set. Check your .env file.");
}

if (!SOCKET_URL) {
  console.error("Error: REACT_APP_SOCKET_URL is not set. Check your .env file.");
}

export const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`, 
  withCredentials: true,
});