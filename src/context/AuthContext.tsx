import { createContext, useContext, useState, type ReactNode } from 'react'

interface User {
  email: string
  isAuthenticated: boolean
  companyName: string | null
  websiteUrl: string | null
}

interface AuthContextValue {
  user: User | null
  signup: (email: string) => void
  setOnboardingData: (companyName: string, websiteUrl: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const signup = (email: string) => {
    setUser({ email, isAuthenticated: true, companyName: null, websiteUrl: null })
  }

  const setOnboardingData = (companyName: string, websiteUrl: string) => {
    setUser(prev => prev ? { ...prev, companyName, websiteUrl } : prev)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, signup, setOnboardingData, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
