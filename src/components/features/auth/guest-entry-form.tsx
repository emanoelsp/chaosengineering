'use client'

import { useState } from 'react'
import { signInAnonymously, updateProfile } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase/client'

export function GuestEntryForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { user } = await signInAnonymously(auth)
      await updateProfile(user, { displayName: name })
      localStorage.setItem('guest_name', name)
      localStorage.setItem('guest_email', email)
      router.push('/jornada')
    } catch {
      setError('Não foi possível entrar. Verifique a conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
      <input
        type="text"
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <input
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      <button
        type="submit"
        disabled={loading || !name.trim() || !email.trim()}
        className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white font-black text-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
      >
        {loading ? 'Entrando...' : '🔥 Iniciar Jornada'}
      </button>
    </form>
  )
}
