import { useState } from 'react'
import './App.css'
import { axiosInstance } from './apiConfig/axios'

function App() {
  const [email, setEmail] = useState('admin@gmail.com')
  const [password, setPassword] = useState('12345678')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')

  const handleClick = async () => {
    setLoading(true)
    setError(null)
    setMessage('')
    
    try {
      // Step 1: Get CSRF token first
      console.log('Fetching CSRF token...')
      await axiosInstance.get('/sanctum/csrf-cookie')
      console.log('CSRF token fetched!')
      
      // Step 2: Attempt login with a small delay to ensure cookie is set
      setMessage('CSRF token fetched, attempting login...')
      
      setTimeout(async () => {
        try {
          console.log('Attempting login...')
          
          // Get the CSRF token from cookies
          const token = getCookie('XSRF-TOKEN')
          console.log('Found CSRF token in cookie:', token ? 'Yes' : 'No')
          
          // Set the X-XSRF-TOKEN header explicitly if we have a token
          const headers = {}
          if (token) {
            headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
          }
          
          // Make the login request with explicit headers
          const response = await axiosInstance.post('/login', 
            { email, password },
            { headers }
          )
          
          console.log('Login successful:', response.data)
          setMessage('Login successful!')
          // Handle successful login (e.g., redirect, set auth state, etc.)
        } catch (err) {
          console.error('Login error:', err)
          setError(err.response?.data?.message || 'Login failed')
          setMessage(`Login failed: ${err.message}`)
        } finally {
          setLoading(false)
        }
      }, 500)
    } catch (err) {
      console.error('CSRF token error:', err)
      setError('Failed to set CSRF token')
      setMessage(`CSRF error: ${err.message}`)
      setLoading(false)
    }
  }
  
  // Helper function to get cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
  }

  return (
    <div className="app-container">
      <h1>Login Example</h1>
      
      {error && <div className="error-message">{error}</div>}
      {message && <div className="status-message">{message}</div>}
      
      <div className="form-group">
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      
      <div className="form-group">
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      
      <button 
        onClick={handleClick} 
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      
      <div className="debug-info">
        <h3>Debugging Info:</h3>
        <button onClick={() => console.log('Cookies:', document.cookie)}>
          Log Cookies
        </button>
      </div>
    </div>
  )
}

export default App