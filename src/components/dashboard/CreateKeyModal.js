'use client'

import { useState, useCallback } from 'react'
import Modal from '@/components/Modal'

export default function CreateKeyModal({
  isOpen = false,
  onClose,
  onCreateKey
}) {
  const [newKeyName, setNewKeyName] = useState("")
  const [keyType, setKeyType] = useState("development")
  const [limitMonthlyUsage, setLimitMonthlyUsage] = useState(false)
  const [monthlyLimit, setMonthlyLimit] = useState(1000)

  const resetForm = useCallback(() => {
    setNewKeyName("")
    setKeyType("development")
    setLimitMonthlyUsage(false)
    setMonthlyLimit(1000)
    onClose()
  }, [onClose])

  const handleSubmit = useCallback(async (e) => {
    if (e) e.stopPropagation()
    await onCreateKey(newKeyName, keyType, limitMonthlyUsage, monthlyLimit)
    resetForm()
  }, [onCreateKey, newKeyName, keyType, limitMonthlyUsage, monthlyLimit, resetForm])

  const handleKeyNameChange = useCallback((e) => {
    setNewKeyName(e.target.value)
  }, [])

  const handleKeyTypeChange = useCallback((type) => {
    setKeyType(type)
  }, [])

  const handleLimitChange = useCallback((e) => {
    setLimitMonthlyUsage(e.target.checked)
  }, [])

  const handleMonthlyLimitChange = useCallback((e) => {
    setMonthlyLimit(Number(e.target.value))
  }, [])

  const handleCancel = useCallback((e) => {
    if (e) e.stopPropagation()
    resetForm()
  }, [resetForm])

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetForm}
      title="Create a new API key"
    >
      <div style={{ padding: '24px' }}>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          Enter a name and limit for the new API key.
        </p>
        
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="keyName" style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>
            Key Name — A unique name to identify this key
          </label>
          <input
            id="keyName"
            type="text"
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '999px', outline: 'none' }}
            placeholder="Key Name"
            value={newKeyName}
            onChange={handleKeyNameChange}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>
            Key Type — Choose the environment for this key
          </label>
          
          <div 
            style={{ 
              marginBottom: '8px',
              padding: '12px',
              border: `1px solid ${keyType === 'production' ? '#3b82f6' : '#d1d5db'}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleKeyTypeChange('production')}
          >
            <div style={{ marginRight: '8px', color: '#2dd4bf' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M17 11.5C17 14.5376 14.5376 17 11.5 17C8.46243 17 6 14.5376 6 11.5C6 8.46243 8.46243 6 11.5 6C14.5376 6 17 8.46243 17 11.5Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: '500' }}>Production</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Rate limited to 1,000 requests/minute</div>
            </div>
          </div>
          
          <div 
            style={{ 
              padding: '12px',
              border: `1px solid ${keyType === 'development' ? '#3b82f6' : '#d1d5db'}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleKeyTypeChange('development')}
          >
            <div style={{ marginRight: '8px' }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                border: `1px solid ${keyType === 'development' ? '#3b82f6' : '#d1d5db'}`
              }}>
                {keyType === 'development' && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6' }}></div>}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: '500' }}>Development</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Rate limited to 100 requests/minute</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              id="limitUsage"
              type="checkbox"
              style={{ marginRight: '8px' }}
              checked={limitMonthlyUsage}
              onChange={handleLimitChange}
            />
            <label htmlFor="limitUsage" style={{ fontSize: '14px' }}>
              Limit monthly usage*
            </label>
          </div>
          {limitMonthlyUsage && (
            <input
              type="number"
              style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '8px' }}
              placeholder="1000"
              value={monthlyLimit}
              onChange={handleMonthlyLimitChange}
            />
          )}
        </div>
        
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '16px' }}>
          * If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
        </p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', padding: '24px', paddingTop: '0' }}>
        <button
          style={{ 
            background: '#4361EE', 
            color: 'white', 
            padding: '8px 24px', 
            border: 'none', 
            borderRadius: '999px', 
            fontWeight: 'normal',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1010
          }}
          onClick={handleSubmit}
          type="button"
        >
          Create
        </button>
        <button
          style={{ 
            background: 'transparent', 
            color: '#4b5563', 
            padding: '8px', 
            border: 'none', 
            fontWeight: 'normal',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1010
          }}
          onClick={handleCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
} 