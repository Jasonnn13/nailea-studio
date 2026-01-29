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
        // Try to get token from localStorage (for backward compatibility)
        // or rely on httpOnly cookie (handled automatically)
        const token = localStorage.getItem('authToken')
        
        // Verify token with server (cookie is sent automatically)
        const headers: HeadersInit = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch('/api/auth/me', {
          headers,
          credentials: 'include' // Include cookies
        })

        if (!response.ok) {
          // Token invalid, clear localStorage
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

  const logout = async () => {
    try {
      // Call logout API to clear httpOnly cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    // Clear localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/login')
  }

  return { user, loading, logout }
}
