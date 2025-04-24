'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

// Separate client component that uses useSearchParams
function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboards'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Clear cookies if force login flag is set
  useEffect(() => {
    const forceLogin = sessionStorage.getItem('forceLogin')
    if (forceLogin === 'true') {
      // Clear the flag
      sessionStorage.removeItem('forceLogin')
      
      // Try to clear any existing Google auth sessions
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=')
        if (name.includes('next-auth') || name.includes('google')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        }
      })
    }
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Force Google to show account selection screen
      const result = await signIn('google', {
        callbackUrl,
        redirect: true,
        prompt: 'select_account'
      })
      
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError('An error occurred during sign in')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or return to the <button onClick={() => router.push('/')} className="text-blue-500 hover:underline">homepage</button>
          </p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="mt-8">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white py-4 px-6 rounded-lg border border-gray-300 shadow-sm text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex flex-col items-center"
          >
            {/* Google logo as 32x32 SVG */}
            <svg className="h-[32px] w-[32px] mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
          <h2 className="text-3xl font-bold text-gray-900">Loading...</h2>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
} 