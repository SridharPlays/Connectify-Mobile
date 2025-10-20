import axios from 'axios';

const YOUR_COMPUTER_IP = '192.168.29.106'; 

const API_BASE_URL = `http://${YOUR_COMPUTER_IP}:5001/api`;

export const SOCKET_URL = `http://${YOUR_COMPUTER_IP}:5001`;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});