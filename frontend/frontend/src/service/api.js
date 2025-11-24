import axios from 'axios'; // for interaction 

const baseUrl = 'http://localhost:3000/api'

const api = axios.create({
    baseURL: baseUrl,
    timeout: 10000000000000000000000000000000,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const Api_Endpoints = {
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/register'
    }
}

export default api;