
import { useState } from 'react'

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    contact_number: '',
    password: '',
    confirm_password: ''
  })

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }

  async function handleSignup(e) {
    e.preventDefault()

    setMessage('')
    setMessageType('')

    if (formData.password !== formData.confirm_password) {
      setMessage('Passwords do not match.')
      setMessageType('danger')
      return
    }

    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters.')
      setMessageType('danger')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost/assys-craft-and-blooms/backend/api/register.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed.')
      }

      setMessage(result.message)
      setMessageType('success')

      setFormData({
        full_name: '',
        email: '',
        contact_number: '',
        password: '',
        confirm_password: ''
      })

      setTimeout(() => {
        window.history.pushState({}, '', '/login')
        window.dispatchEvent(new PopStateEvent('popstate'))
      }, 2000)

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
          <h2>Create Your Account</h2>

          <p className="auth-description">
            Join us and discover our handmade collections!
          </p>

          {message && (
            <div
              className={`alert alert-${messageType}`}
              role="alert"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="full_name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contact Number</label>
              <input
                type="tel"
                name="contact_number"
                className="form-control"
                placeholder="Enter your contact number"
                value={formData.contact_number}
                onChange={handleChange}
                maxLength={30}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>

              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>

              <div className="input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  className="form-control"
                  placeholder="Confirm your password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 mt-3"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-4">
            Already have an account? <a href="/login">Log In</a>
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

export default Signup
