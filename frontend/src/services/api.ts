import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // Important for sessions/cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add request interceptor for error handling
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or clear auth state
      console.error('Unauthorized access')
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Forbidden access')
    } else if (error.response?.status === 500) {
      // Server error
      console.error('Server error')
    }
    return Promise.reject(error)
  }
)

// Health check endpoint
export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`)
    return response.data
  } catch (error) {
    console.error('Health check failed:', error)
    throw error
  }
}

// Export for direct use
export default apiClient
