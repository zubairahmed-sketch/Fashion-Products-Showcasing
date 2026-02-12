import { useState } from 'react'
import { useAuth } from '../utils/authContext'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    
    if (!email || !password) {
      setError('Please fill in all fields')
      setSubmitting(false)
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setSubmitting(false)
      return
    }
    
    try {
      const { error: loginError } = await login(email, password)
      if (loginError) {
        setError(loginError.message || 'Invalid credentials')
      }
    } catch (err) {
      setError('Unable to sign in right now. Please try again.')
      console.error('Login error', err)
    }
    setSubmitting(false)
  }
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Dashboard</h1>
          <p>Fashion Products Management</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn-login" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
