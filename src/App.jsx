import AdminDashboard from './pages/AdminDashboard'
import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CustomerDashboard from './pages/CustomerDashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState(
    window.location.pathname
  )

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  if (currentPage === '/login') {
    return <Login />
  }

  if (currentPage === '/signup') {
    return <Signup />
  }

  if (currentPage === '/shop') {
    return <CustomerDashboard />
  }

  if (currentPage === '/about') {
    return <About />
  }

  if (currentPage === '/contact') {
    return <Contact />
  }
if (currentPage === '/admin-dashboard') {
  return <AdminDashboard />
}
  return <LandingPage />
}

export default App
