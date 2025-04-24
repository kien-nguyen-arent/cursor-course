import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * Gets the session on the server side
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Checks if the user is authenticated on the server side
 */
export async function getCurrentUser() {
  const session = await getSession()
  
  return session?.user
}

/**
 * Server component to check if user is authenticated
 * Use this in server components that need to be protected
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
} 