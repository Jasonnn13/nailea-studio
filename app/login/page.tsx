'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials')
      }
      
      // Store token and redirect to admin dashboard
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center px-4">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="font-script text-5xl text-primary mb-2">Nailea</div>
            <p className="text-xs tracking-widest font-semibold text-foreground">STUDIO</p>
          </Link>
        </div>

        {/* Card */}
        <Card className="border border-accent/20 bg-card/50 backdrop-blur-sm">
          <div className="p-8">
            <h1 className="font-heading text-3xl text-foreground text-center mb-2 tracking-wider">ADMIN LOGIN</h1>
            <p className="text-center text-sm text-foreground/60 mb-8">Access your studio dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground tracking-wide">EMAIL</label>
                <Input
                  type="email"
                  placeholder="admin@naileastudio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-accent/30 bg-background/50 text-foreground placeholder:text-foreground/40"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground tracking-wide">PASSWORD</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-accent/30 bg-background/50 text-foreground placeholder:text-foreground/40"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-medium"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            {/* Divider */}
            {/* <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-accent/20"></div>
              <span className="text-xs text-foreground/50">OR</span>
              <div className="flex-1 h-px bg-accent/20"></div>
            </div> */}

            {/* Register link
            <p className="text-center text-sm text-foreground/60">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:text-primary/80 font-medium">
                Register here
              </Link>
            </p> */}
          </div>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-foreground/60 hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
