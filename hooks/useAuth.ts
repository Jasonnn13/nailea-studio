'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  uid: string
  nama: string
  email: string
  role: string
  aktif: boolean
}

export function useAuth(requireAuth = true) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        
        if (!token) {
          if (requireAuth) {
            router.push('/login')
          }
          setLoading(false)
          return
        }

        // Verify token with server
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          // Token invalid, clear storage and redirect
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
          if (requireAuth) {
            router.push('/login')
          }
          setLoading(false)
          return
        }

        const data = await response.json()
        setUser(data.user)
        setLoading(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        if (requireAuth) {
          router.push('/login')
        }
        setLoading(false)
      }
    }

    checkAuth()
  }, [requireAuth, router])

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return { user, loading, logout }
}
