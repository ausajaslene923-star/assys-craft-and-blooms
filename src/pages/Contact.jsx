
import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

 
const [loading, setLoading] = useState(false)
const [responseMessage, setResponseMessage] = useState('')
const [responseSuccess, setResponseSuccess] = useState(false)

const handleSubmit = async (event) => {
  event.preventDefault()

  setLoading(true)
  setResponseMessage('')

  try {
    const response = await fetch(
      'http://localhost/assys-craft-and-blooms/backend/api/send-contact-message.php',
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
      throw new Error(result.message || 'Unable to send your message.')
    }

    setResponseSuccess(true)
    setResponseMessage(result.message)

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

  } catch (error) {
    setResponseSuccess(false)
    setResponseMessage(
      error.message || 'Something went wrong. Please try again.'
    )

  } finally {
    setLoading(false)
  }
}


  return (
    <div className="contact-page">

      <header className="contact-header">
  <h1>Assy's Craft and Blooms</h1>
  <p>Handmade with Love, Made Just for You</p>
</header>

<div className="contact-navigation">
  <button
    className="contact-back-button"
    onClick={() => window.location.href = '/shop'}
  >
    ← Back to Shop
  </button>
</div>

      <main className="contact-container">

        <section className="contact-intro">
          <h2>Contact Us</h2>
          <p>
            Have questions about our handmade products?
            We'd love to hear from you!
          </p>
        </section>

        <section className="contact-content">

          <div className="contact-information">
            <h3>Get in Touch</h3>

            <p>
              <strong>Shop Name:</strong><br />
              Assy's Craft and Blooms
            </p>

            <p>
              <strong>Email:</strong><br />
              jaslene_ausa@sjp2cd.edu.ph
            </p>

            <p>
              <strong>Contact Number:</strong><br />
             0912-567-8901
            </p>

            <p>
              <strong>Business Hours:</strong><br />
              Please message us for availability.
            </p>
          </div>

          <div className="contact-form-card">
            <h3>Send Us a Message</h3>
            
{responseMessage && (
  <div className={responseSuccess ? 'contact-success' : 'contact-error'}>
    {responseMessage}
  </div>
)}


            <form onSubmit={handleSubmit}>

              <div className="contact-form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter message subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
  {loading ? 'Sending...' : 'Send Message'}
</button>

            </form>
          </div>

        </section>
      </main>

      <footer className="contact-footer">
        <p>
          © {new Date().getFullYear()} Assy's Craft and Blooms.
          All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default Contact
