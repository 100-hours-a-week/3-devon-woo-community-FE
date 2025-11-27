import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { httpClient } from '@/api'
import type { MemberResponse } from '@/types/member'
import type { LoginRequest, SignupRequest } from '@/types/auth'
import { authApi } from '@/api/authApi'

interface AuthContextType {
  user: MemberResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  signup: (data: SignupRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MemberResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data)
    if (response.success && response.data) {
      httpClient.setAccessToken(response.data.accessToken)
      setUser({ id: response.data.userId } as MemberResponse)
    } else {
      throw new Error(response.message || 'Login failed')
    }
  }

  const signup = async (data: SignupRequest) => {
    const response = await authApi.signup(data)
    if (response.success && response.data) {
      httpClient.setAccessToken(response.data.accessToken)
      setUser({ id: response.data.userId } as MemberResponse)
    } else {
      throw new Error(response.message || 'Signup failed')
    }
  }

  const logout = () => {
    httpClient.clearTokens()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
