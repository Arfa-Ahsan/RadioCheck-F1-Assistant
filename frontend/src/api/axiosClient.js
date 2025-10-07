import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

const axiosClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send cookies for session-based auth
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosClient