'use client'

import React from 'react'

export default function PlanCard({ planName = 'Researcher', usage = 0, limit = 1000 }) {
  // Calculate the usage percentage
  const usagePercentage = Math.min(100, Math.round((usage / limit) * 100)) || 0
  
  return (
    <div style={{ 
      padding: '20px', 
      borderRadius: '10px', 
      background: 'linear-gradient(to right, #f87171, #8b5cf6, #3b82f6)', 
      color: 'white' 
    }}>
      <div style={{ marginBottom: '20px' }}>
        <span style={{ 
          display: 'inline-block', 
          padding: '4px 8px', 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '20px', 
          fontSize: '12px', 
          marginBottom: '10px' 
        }}>
          CURRENT PLAN
        </span>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>{planName}</h2>
      </div>
      
      <div>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: '18px', fontWeight: '500' }}>API Usage</span>
        </div>
        <div style={{ marginBottom: '5px' }}>Plan</div>
        <div style={{ 
          width: '100%', 
          height: '8px', 
          background: 'rgba(255,255,255,0.3)', 
          borderRadius: '4px', 
          marginBottom: '10px' 
        }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${usagePercentage}%`, 
              background: 'white', 
              borderRadius: '4px' 
            }}
          ></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Pay as you go</div>
          <div>{usage} / {limit.toLocaleString()} Credits</div>
        </div>
      </div>
    </div>
  )
} 