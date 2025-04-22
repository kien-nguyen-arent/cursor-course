'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Notification from '@/components/Notification'

export default function PlaygroundPage() {
  const router = useRouter()
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'info'
  })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!apiKey.trim()) {
      setNotification({
        visible: true,
        message: 'Please enter an API key',
        type: 'error'
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      // In a real application, this would be a fetch to your API validation endpoint
      // For demo purposes, we'll consider keys starting with "arent-" as valid
      const isValid = apiKey.startsWith('arent-')
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (isValid) {
        // Store validation result in sessionStorage (temporary for this session only)
        sessionStorage.setItem('apiKeyValidated', 'true')
        sessionStorage.setItem('apiKey', apiKey) // Store for demo purposes
        
        // Show success notification
        setNotification({
          visible: true,
          message: 'Valid API key, /protected can be accessed',
          type: 'success'
        })
        
        // Navigate to protected page after notification is shown
        setTimeout(() => {
          router.push('/protected')
        }, 1000)
      } else {
        // Show error notification
        setNotification({
          visible: true,
          message: 'Invalid API key',
          type: 'error'
        })
        setIsLoading(false)
      }
    } catch (error) {
      setNotification({
        visible: true,
        message: 'An error occurred. Please try again.',
        type: 'error'
      })
      setIsLoading(false)
    }
  }
  
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }))
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
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>API Playground</h1>
          
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
            Enter your API key to access the protected resources. The key will be validated securely before granting access.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="apiKey" style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                API Key
              </label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              style={{ 
                background: '#4361EE', 
                color: 'white', 
                padding: '10px 16px', 
                border: 'none', 
                borderRadius: '6px', 
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? 'Validating...' : 'Submit API Key'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 