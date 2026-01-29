import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, validateEmail, generateToken, sanitizeUser } from '@/lib/auth'

// Rate limiting map (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

// Development vs Production settings
const isDev = process.env.NODE_ENV === 'development'
const MAX_ATTEMPTS = isDev ? 20 : 5
const LOCKOUT_TIME = isDev ? 60 * 1000 : 15 * 60 * 1000 // 1 min in dev, 15 min in prod

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  // Reset if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((LOCKOUT_TIME - (now - attempts.lastAttempt)) / 1000)
    return { allowed: false, retryAfter }
  }

  attempts.count++
  attempts.lastAttempt = now
  return { allowed: true }
}

function resetRateLimit(ip: string) {
  loginAttempts.delete(ip)
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Check rate limit
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${rateLimit.retryAfter} seconds` },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Generic error message to prevent user enumeration
    const invalidCredentialsError = { error: 'Invalid email or password' }

    if (!user) {
      return NextResponse.json(invalidCredentialsError, { status: 401 })
    }

    // Check if user is active
    if (!user.aktif) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact administrator.' },
        { status: 403 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(invalidCredentialsError, { status: 401 })
    }

    // Reset rate limit on successful login
    resetRateLimit(ip)

    // Generate token
    const token = generateToken({
      userId: user.id,
      uid: user.uid,
      email: user.email,
      role: user.role,
    })

    // Create response with sanitized user and token
    const response = NextResponse.json({
      message: 'Login successful',
      user: sanitizeUser(user),
      token,
    })

    // Set httpOnly cookie for better security (works with middleware)
    const isProduction = process.env.NODE_ENV === 'production'
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
