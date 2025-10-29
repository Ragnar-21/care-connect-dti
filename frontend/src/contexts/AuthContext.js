import React, { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

// Utility function to decode JWT token
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
    return null
  }
}

// Utility function to check if token is expired
const isTokenExpired = (token) => {
  const decoded = decodeToken(token)
  if (!decoded) return true
  return decoded.exp * 1000 < Date.now()
}

const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  userData: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  setUserData: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [userData, setUserData] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // Add loading state

  // Check for existing token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('userData')
    const storedRole = localStorage.getItem('userRole')

    if (storedToken && storedUser && storedRole) {
      // Check if token is expired
      if (isTokenExpired(storedToken)) {
        // Token is expired, clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        localStorage.removeItem('userRole')
      } else {
        setToken(storedToken)
        setUserData(JSON.parse(storedUser))
        setUserRole(storedRole)
        setIsAuthenticated(true)
      }
    }
    setIsLoading(false) // Set loading to false after checking
  }, [])

  // Periodic token validation
  useEffect(() => {
    if (!isAuthenticated || !token) return

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        logout()
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [isAuthenticated, token])

  const login = (role, user, authToken) => {
    setIsAuthenticated(true)
    setUserRole(role)
    setUserData(user)
    setToken(authToken)
    setIsLoading(false) // Ensure loading is false after login

    // Store in localStorage for persistence
    localStorage.setItem('token', authToken)
    localStorage.setItem('userData', JSON.stringify(user))
    localStorage.setItem('userRole', role)
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    setUserData(null)
    setToken(null)
    setIsLoading(false) // Ensure loading is false after logout

    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    localStorage.removeItem('userRole')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userData,
        token,
        isLoading,
        login,
        logout,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
