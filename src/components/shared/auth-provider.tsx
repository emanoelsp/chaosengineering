'use client'

import { createContext, useContext } from 'react'
import { useAuth } from '@/hooks/use-auth'
import type { UserRole } from '@/types'
import type { User } from 'firebase/auth'

interface AuthContextValue {
  user: User | null
  role: UserRole | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext)
}
