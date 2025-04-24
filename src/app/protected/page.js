'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Notification from '@/components/Notification'

// Separate client component that uses useRouter
function ProtectedContent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isValidKey, setIsValidKey] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'info'
  })

  useEffect(() => {
    const checkAuthorization = async () => {
      // Get validation status from session storage
      const isValidated = sessionStorage.getItem('apiKeyValidated') === 'true'
      const storedKey = sessionStorage.getItem('apiKey')
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (isValidated && storedKey) {
        setIsValidKey(true)
        setApiKey(storedKey)
        
        // Optionally show the notification again
        setNotification({
          visible: true,
          message: 'Valid API key, /protected can be accessed',
          type: 'success'
        })
      } else {
        setNotification({
          visible: true,
          message: 'Access denied. No valid API key found.',
          type: 'error'
        })
      }
      
      setIsLoading(false)
    }
    
    checkAuthorization()
  }, [])
  
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }))
  }

  const goBack = () => {
    router.push('/playground')
  }

  const clearSession = () => {
    sessionStorage.removeItem('apiKeyValidated')
    sessionStorage.removeItem('apiKey')
    router.push('/playground')
  }

  return (
    <div style={{ display: 'flex', background: '#f8f9fa', minHeight: '100vh' }}>
      <Sidebar />
      
      <Notification 
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      <div style={{ 
        flex: '1', 
        marginLeft: '280px', 
        padding: '20px',
        transition: 'margin-left 0.3s ease-in-out'
      }}>
        <div style={{ maxWidth: '800px', margin: '40px auto', background: 'white', borderRadius: '10px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Protected Area</h1>
          
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p>Checking authorization...</p>
            </div>
          ) : isValidKey ? (
            <div>
              <p style={{ fontSize: '16px', marginBottom: '20px' }}>
                Welcome to the protected area! Your API key has been successfully validated.
              </p>
              
              <div style={{ 
                padding: '16px', 
                background: '#f0fdf4', 
                border: '1px solid #86efac', 
                borderRadius: '6px',
                marginBottom: '24px' 
              }}>
                <p style={{ color: '#15803d', fontSize: '14px' }}>
                  You now have access to all protected resources. You can use your API key to make authenticated requests.
                </p>
              </div>
              
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Example API Request</h2>
              <div style={{ 
                background: '#1e293b', 
                color: '#e2e8f0', 
                padding: '16px', 
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '14px',
                overflowX: 'auto',
                marginBottom: '24px'
              }}>
                <pre style={{ margin: 0 }}>
{`curl -X POST "https://api.arentcourse.com/v1/data" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '16px', marginBottom: '20px', color: '#b91c1c' }}>
                Access denied. No valid API key found.
              </p>
              
              <div style={{ 
                padding: '16px', 
                background: '#fef2f2', 
                border: '1px solid #fca5a5', 
                borderRadius: '6px',
                marginBottom: '24px' 
              }}>
                <p style={{ color: '#b91c1c', fontSize: '14px' }}>
                  Please provide a valid API key to access this protected area. You can get an API key from your dashboard.
                </p>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={goBack}
              style={{ 
                background: '#f3f4f6', 
                color: '#4b5563', 
                padding: '10px 16px', 
                border: 'none', 
                borderRadius: '6px', 
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Back to Playground
            </button>
            
            {isValidKey && (
              <button
                onClick={clearSession}
                style={{ 
                  background: '#fee2e2', 
                  color: '#b91c1c', 
                  padding: '10px 16px', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function ProtectedPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    }>
      <ProtectedContent />
    </Suspense>
  )
} 