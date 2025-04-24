'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Separate client component that uses useRouter
function SignOutContent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = useCallback(async () => {
    try {
      setIsLoading(true)
      await signOut({ redirect: false })
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }, [router, setIsLoading])

  useEffect(() => {
    // Auto sign out after 3 seconds if user doesn't click the button
    const timer = setTimeout(() => {
      handleSignOut()
    }, 3000)

    return () => clearTimeout(timer)
  }, [handleSignOut])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sign out</h2>
        <p className="text-gray-600">
          You are being signed out. Click the button to sign out immediately.
        </p>
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? 'Signing out...' : 'Sign out now'}
        </button>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function SignOut() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
          <h2 className="text-3xl font-bold text-gray-900">Loading...</h2>
        </div>
      </div>
    }>
      <SignOutContent />
    </Suspense>
  )
} 