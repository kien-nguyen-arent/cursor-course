'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginStatus() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  if (isLoading) {
    return (
      <button 
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center gap-2 px-4 py-2 text-sm"
        disabled
      >
        <span className="animate-pulse">Loading...</span>
      </button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <Link 
          href="/dashboards"
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-3 py-1.5 text-sm"
        >
          Dashboard
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] px-2 py-1.5">
          {session.user?.image ? (
            <Image 
              src={session.user.image} 
              alt={session.user.name || 'User'} 
              width={24} 
              height={24} 
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
              {session.user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <span className="text-sm max-w-24 truncate">{session.user?.name}</span>
          <button 
            onClick={() => signOut({ callbackUrl: '/auth/signout' })}
            className="text-red-500 hover:text-red-700 transition-colors ml-1 text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <button 
      onClick={() => signIn('google', { callbackUrl: '/dashboards' })}
      className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 hover:border-transparent font-medium text-sm h-10 px-4"
    >
      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Sign in with Google
    </button>
  )
} 