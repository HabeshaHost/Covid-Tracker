import axios from 'axios';

export const BASE_URL = "http://localhost:5001/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  responseEncoding: 'utf8',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
