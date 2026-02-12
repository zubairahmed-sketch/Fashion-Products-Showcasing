import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (isMounted) {
          setUser(data.session?.user || null)
          setLoading(false)
        }
      } catch (err) {
        console.error('Supabase session error', err)
        if (isMounted) setLoading(false)
      }
    }

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    init()

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error }
    setUser(data.session?.user || null)
    return { error: null }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
