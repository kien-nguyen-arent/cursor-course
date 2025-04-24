'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

const getErrorMessage = (error) => {
  switch (error) {
    case 'AccessDenied':
      return 'You do not have permission to sign in.'
    case 'Configuration':
      return 'There is a problem with the server configuration. Please contact support.'
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
    case 'OAuthAccountNotLinked':
      return 'There was a problem with the OAuth authentication. Please try again.'
    case 'EmailCreateAccount':
    case 'Callback':
    case 'EmailSignin':
      return 'There was a problem with the email authentication. Please try again.'
    case 'CredentialsSignin':
      return 'The sign in details you provided were invalid. Please check your credentials and try again.'
    case 'SessionRequired':
      return 'Please sign in to access this page.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

// Separate client component that uses useSearchParams
function ErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const errorType = searchParams.get('error')
    if (errorType) {
      setError(getErrorMessage(errorType))
    } else {
      setError('An unexpected error occurred')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
        <h2 className="text-3xl font-bold text-gray-900">Authentication Error</h2>
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
        <div className="mt-4">
          <button 
            onClick={() => router.push('/auth/signin')}
            className="mr-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
          <h2 className="text-3xl font-bold text-gray-900">Loading...</h2>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
} 