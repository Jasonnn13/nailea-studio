// Helper to get auth headers for API calls
export const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// Helper for fetch with credentials (sends httpOnly cookie)
export const authFetch = (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // Include cookies
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })
}
