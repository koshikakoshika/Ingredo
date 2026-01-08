import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { authService } from './services/authService'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import Button from './components/Button'

import LandingPage from './pages/LandingPage'

import ScanPage from './pages/ScanPage'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <ProtectedRoute>
              <ScanPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="mt-auto py-6 text-center text-xs text-gray-400 border-t border-gray-100">
        <p>This application provides informational guidance only and does not replace medical or regulatory advice.</p>
        <p className="mt-1">© {new Date().getFullYear()} Ingredo</p>
      </footer>
    </div>
  )
}

export default App
