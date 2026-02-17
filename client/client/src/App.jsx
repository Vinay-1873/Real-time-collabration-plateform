import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Login from './componets/Login'
import Signup from './componets/Signup'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // Redirect to dashboard or main app if logged in
      setCurrentPage('dashboard')
    } else {
      // Show login page if not logged in
      setCurrentPage('login')
    }
  }

  const handleLoginClose = () => {
    setCurrentPage('landing')
    setIsLoggedIn(true)
  }

  const handleSignupClose = () => {
    setCurrentPage('landing')
    setIsLoggedIn(true)
  }

  const handleSwitchToSignup = () => {
    setCurrentPage('signup')
  }

  const handleSwitchToLogin = () => {
    setCurrentPage('login')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setCurrentPage('landing')
  }

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} onLogout={handleLogout} isLoggedIn={isLoggedIn} />
      )}
      {currentPage === 'login' && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="w-full max-w-md">
            <button
              onClick={() => setCurrentPage('landing')}
              className="mb-4 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back
            </button>
            <Login onClose={handleLoginClose} onSwitchToSignup={handleSwitchToSignup} />
          </div>
        </div>
      )}
      {currentPage === 'signup' && (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="w-full max-w-md">
            <button
              onClick={() => setCurrentPage('landing')}
              className="mb-4 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back
            </button>
            <Signup onClose={handleSignupClose} onSwitchToLogin={handleSwitchToLogin} />
          </div>
        </div>
      )}
    </>
  )
}

export default App
