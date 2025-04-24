'use client'

import { useState, useEffect, useCallback } from 'react'
import Modal from '@/components/Modal'

export default function EditKeyModal({
  isOpen = false,
  onClose,
  onSaveEdit,
  keyData = null
}) {
  const [keyName, setKeyName] = useState("")

  useEffect(() => {
    if (keyData) {
      setKeyName(keyData.name || "")
    }
  }, [keyData])

  const resetForm = useCallback(() => {
    setKeyName("")
    onClose()
  }, [onClose])

  const handleSubmit = useCallback(async (e) => {
    if (e) e.stopPropagation()
    if (!keyData?.id) return
    await onSaveEdit(keyData.id, keyName)
    resetForm()
  }, [keyData, keyName, onSaveEdit, resetForm])

  const handleKeyNameChange = useCallback((e) => {
    setKeyName(e.target.value)
  }, [])

  const handleCancel = useCallback((e) => {
    if (e) e.stopPropagation()
    resetForm()
  }, [resetForm])

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetForm}
      title="Edit API key"
    >
      <div style={{ padding: '24px' }}>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          Edit the name of your API key.
        </p>
        
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="editKeyName" style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>
            Key Name — A unique name to identify this key
          </label>
          <input
            id="editKeyName"
            type="text"
            style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '999px', outline: 'none' }}
            placeholder="Key Name"
            value={keyName}
            onChange={handleKeyNameChange}
          />
        </div>
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
          Save
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