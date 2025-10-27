// Centralized API Configuration
// Single URL that works everywhere (mobile + web)

// Auto-detect API URL based on current location
const getApiUrl = () => {
  // Check for environment variable first (set in Vercel)
  if (process.env.REACT_APP_API_URL) {
    const url = process.env.REACT_APP_API_URL;
    // Ensure it ends without trailing slash
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  
  // Detect if we're on Vercel
  const isVercel = window.location.hostname.includes('vercel.app');
  
  if (isVercel) {
    // For Vercel, use the Render backend
    return 'https://mindmix-iuzf.onrender.com';
  }
  
  // Check if we have a tunnel URL
  if (window.location.hostname.includes('loca.lt')) {
    // Use the backend tunnel URL
    return 'https://mindmix-backend.loca.lt';
  }
  
  // Detect if we're on a tunnel
  const isTunnel = !window.location.hostname.includes('localhost') && 
                    !window.location.hostname.includes('127.0.0.1') &&
                    (window.location.hostname.includes('loca.lt') || 
                     window.location.hostname.includes('serveo') ||
                     window.location.hostname.includes('ngrok'));
  
  // For tunnels, use the same origin
  if (isTunnel) {
    return window.location.origin;
  }
  
  // For localhost, use direct backend URL
  return 'http://192.168.0.109:4000';
};

const API_URL = getApiUrl();

console.log('🔗 API URL:', API_URL);
console.log('🌐 Current location:', window.location.origin);

// API Helper function (optional, for advanced usage)
export const apiCall = async (method, endpoint, data = null, token = null, retries = 2) => {
  const config = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...(data && { data }),
    timeout: 10000 // 10 second timeout
  };

  for (let i = 0; i <= retries; i++) {
    try {
      const axiosLib = require('axios');
      const response = await axiosLib(config);
      return response.data;
    } catch (error) {
      // Log error details
      console.error(`API call failed (attempt ${i + 1}/${retries + 1}):`, error.message);
      
      if (i === retries) {
        // Last attempt failed, throw error
        const err = new Error(error.response?.data?.error || error.message || 'Network error');
        err.status = error.response?.status || 500;
        err.isConnectionError = error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK';
        err.apiUrl = API_URL;
        throw err;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

// Export API_URL for direct use
export default API_URL;
