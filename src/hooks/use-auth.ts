'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'
import type { UserRole } from '@/types'

interface AuthState {
  user: User | null
  role: UserRole | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, role: null, loading: true })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, role: null, loading: false })
        return
      }

      const snap = await getDoc(doc(db, 'users', user.uid))
      const role = (snap.data()?.role as UserRole) ?? 'aluno'
      setState({ user, role, loading: false })
    })

    return unsubscribe
  }, [])

  return state
}

export function useRequireRole(requiredRole: UserRole) {
  const { user, role, loading } = useAuth()
  const authorized = !loading && !!user && (
    role === requiredRole ||
    role === 'admin' ||
    (requiredRole === 'aluno')
  )
  return { authorized, loading }
}
