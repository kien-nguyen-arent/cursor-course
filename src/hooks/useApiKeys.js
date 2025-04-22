'use client'

import { useState, useCallback } from 'react'

export default function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visibleKeys, setVisibleKeys] = useState({})

  const fetchApiKeys = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/keys')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch API keys')
      }
      
      const { data } = await response.json()
      setApiKeys(data || [])
    } catch (err) {
      console.error('Error fetching API keys:', err)
      setError(err.message || 'Failed to load API keys')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createApiKey = useCallback(async (newKeyName, keyType, limitMonthlyUsage, monthlyLimit) => {
    try {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      let newKey = `arent-kient-${keyType === 'development' ? 'dev' : 'prod'}-`
      for (let i = 0; i < 30; i++) {
        newKey += characters.charAt(Math.floor(Math.random() * characters.length))
      }

      const newApiKey = {
        name: newKeyName || "New API Key",
        type: keyType === 'development' ? 'dev' : 'prod',
        key: newKey,
        usage: 0,
        monthly_limit: limitMonthlyUsage ? monthlyLimit : null
      }

      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApiKey),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create API key')
      }
      
      // Refresh the API keys list
      await fetchApiKeys()
      return { success: true }
    } catch (err) {
      console.error('Error creating API key:', err)
      setError(err.message || 'Failed to create API key')
      return { success: false, error: err.message }
    }
  }, [fetchApiKeys])

  const updateApiKey = useCallback(async (keyId, keyName) => {
    if (!keyId) return { success: false, error: 'No key ID provided' }
    
    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: keyName }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update API key')
      }
      
      // Update local state
      setApiKeys(prevKeys => 
        prevKeys.map(key => 
          key.id === keyId 
            ? { ...key, name: keyName || key.name } 
            : key
        )
      )
      
      return { success: true }
    } catch (err) {
      console.error('Error updating API key:', err)
      setError(err.message || 'Failed to update API key')
      return { success: false, error: err.message }
    }
  }, [])

  const deleteApiKey = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete API key')
      }
      
      // Update local state
      setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id))
      setVisibleKeys(prev => {
        const newVisible = {...prev}
        delete newVisible[id]
        return newVisible
      })
      
      return { success: true }
    } catch (err) {
      console.error('Error deleting API key:', err)
      setError(err.message || 'Failed to delete API key')
      return { success: false, error: err.message }
    }
  }, [])

  const toggleKeyVisibility = useCallback((key) => {
    setVisibleKeys(prev => ({
      ...prev,
      [key.id]: !prev[key.id]
    }))
  }, [])

  const getDisplayKey = useCallback((key, id) => {
    if (visibleKeys[id]) {
      return key
    }
    return key.substring(0, 12) + "************************"
  }, [visibleKeys])

  return {
    apiKeys,
    isLoading,
    error,
    visibleKeys,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    toggleKeyVisibility,
    getDisplayKey
  }
} 