import { createContext, useContext, useEffect, useState } from 'react'
import * as authService from './authService'

type User = {
  id: string
  email: string
  role: 'admin' | 'user'
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getMe().then((u) => {
      setUser(u?.user ?? null)
      setLoading(false)
    })
  }, [])

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password)
    setUser(data.user)
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)