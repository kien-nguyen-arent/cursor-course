'use client'

import { useEffect } from 'react'
import { CheckCircleIcon, XMarkIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export default function Notification({ 
  visible = false, 
  message = '', 
  type = 'success', 
  onClose,
  autoClose = true,
  duration = 3000
}) {
  useEffect(() => {
    if (visible && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [visible, autoClose, duration, onClose])

  if (!visible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { 
          backgroundColor: '#10b981', 
          icon: <CheckCircleIcon style={{ width: '20px', height: '20px' }} />
        }
      case 'error':
        return { 
          backgroundColor: '#ef4444', 
          icon: <ExclamationCircleIcon style={{ width: '20px', height: '20px' }} />
        }
      case 'info':
        return { 
          backgroundColor: '#3b82f6', 
          icon: <InformationCircleIcon style={{ width: '20px', height: '20px' }} />
        }
      default:
        return { 
          backgroundColor: '#10b981', 
          icon: <CheckCircleIcon style={{ width: '20px', height: '20px' }} />
        }
    }
  }

  const { backgroundColor, icon } = getTypeStyles()

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 1000,
        backgroundColor, 
        color: 'white',
        padding: '12px 20px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '90%',
        width: 'auto'
      }}
    >
      {icon}
      <span>{message}</span>
      <button 
        onClick={onClose}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          marginLeft: '12px',
          padding: '2px' 
        }}
        aria-label="Close notification"
      >
        <XMarkIcon style={{ width: '16px', height: '16px', color: 'white' }} />
      </button>
    </div>
  )
} 