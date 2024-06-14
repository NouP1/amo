import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // URL вашего API сервера
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;