import { createContext, useState, useContext } from 'react'
import { storageService } from '../utils/storage'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storageService.getAdmin())
  
  const login = (email, password) => {
    // Mock secure login - in production, this would verify against backend
    if (email && password && password.length >= 6) {
      const adminUser = { email, loginTime: new Date().toISOString() }
      storageService.setAdmin(adminUser)
      setUser(adminUser)
      return true
    }
    return false
  }
  
  const logout = () => {
    storageService.logout()
    setUser(null)
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
