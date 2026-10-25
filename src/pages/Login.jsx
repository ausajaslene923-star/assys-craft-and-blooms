
import { useState } from 'react'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()

    setMessage('')
    setMessageType('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost/assys-craft-and-blooms/backend/api/login.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
            account_type: accountType
          })
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Login failed.')
      }

      // Save basic account information for frontend display.
      sessionStorage.setItem('user', JSON.stringify(result.user))

      setMessage(result.message)
      setMessageType('success')

      // Temporary role-based navigation.
      setTimeout(() => {
        if (result.user.account_type === 'admin') {
          window.location.href = '/admin-dashboard'
        } else {
          window.location.href = '/shop'
        }
      }, 1000)

    } catch (error) {
      setMessage(
        error.message || 'Unable to connect to the server. Please try again.'
      )
      setMessageType('danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <header className="main-header">
        <h1>Assy's Craft and Blooms</h1>
        <p>Handmade with Love, Made Just for You</p>
      </header>

      <div className="container py-5">
        <div className="auth-card mx-auto">
          <h2>Welcome Back!</h2>

          <p className="auth-description">
            Log in to your Assy's Craft and Blooms account.
          </p>

          {message && (
            <div
              className={`alert alert-${messageType}`}
              role="alert"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Account Type</label>

              <select
                className="form-select"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>

              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>

              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 mt-3"
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <p className="text-center mt-4">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>

          <div className="text-center">
            <a href="/" className="back-link">
              Back to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
