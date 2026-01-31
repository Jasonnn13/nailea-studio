import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

// Runtime check for JWT_SECRET - will throw on first use if not set
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return secret
}

const JWT_EXPIRES_IN = '7d'

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// JWT tokens
export interface TokenPayload {
  userId: number
  uid: string
  email: string
  role: string
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret())
    return decoded as unknown as TokenPayload
  } catch {
    return null
  }
}

// Input validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  return { valid: true }
}

// Sanitize user object (remove password before sending to client)
export function sanitizeUser(user: { id: number; uid: string; nama: string; email: string; role: string; aktif: boolean; createdAt?: Date | string } ) {
  return {
    id: user.id,
    uid: user.uid,
    nama: user.nama,
    email: user.email,
    role: user.role,
    aktif: user.aktif,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
  }
}


// Verify auth from request headers (for API routes)
// Supports both Bearer token and httpOnly cookie
export function verifyAuthFromRequest(request: Request): TokenPayload | null {
  // First, try Authorization header
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    return verifyToken(token)
  }
  
  // Fallback to cookie
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(c => {
        const [key, ...val] = c.split('=')
        return [key, val.join('=')]
      })
    )
    if (cookies.authToken) {
      return verifyToken(cookies.authToken)
    }
  }
  
  return null
}

// Check if user has required role
export function requireRole(user: TokenPayload | null, allowedRoles: string[]): boolean {
  if (!user) return false
  return allowedRoles.includes(user.role)
}

// Require that the request comes from an authenticated admin user.
// Returns a NextResponse (401/403) on failure, or the TokenPayload on success.
export function requireAdminFromRequest(request: Request): TokenPayload | NextResponse {
  const user = verifyAuthFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return user
}
