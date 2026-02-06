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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-secondary/15 flex items-center justify-center px-4">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-secondary/30 via-primary/10 to-transparent blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <div className="relative">
              <span className="font-script text-5xl text-primary">Nailea</span>
              <span className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full -z-10" />
            </div>
            <p className="text-[10px] tracking-[0.3em] text-muted-foreground mt-1">NAIL STUDIO</p>
          </Link>
        </div>

        {/* Card */}
        <Card className="border border-foreground/5 bg-background/60 backdrop-blur-xl shadow-xl shadow-foreground/5">
          <div className="p-8">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Admin Access
              </span>
              <h1 className="font-heading text-2xl text-foreground tracking-wider">Welcome Back</h1>
              <p className="text-sm text-muted-foreground mt-1">Sign in to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Email</label>
                <Input
                  type="email"
                  placeholder="admin@naileastudio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-foreground/10 bg-foreground/[0.03] text-foreground placeholder:text-muted-foreground/50 rounded-xl h-12 focus:border-primary/30 focus:ring-primary/10 transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-foreground/10 bg-foreground/[0.03] text-foreground placeholder:text-muted-foreground/50 rounded-xl h-12 focus:border-primary/30 focus:ring-primary/10 transition-all"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
