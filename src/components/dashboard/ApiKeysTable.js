'use client'

import {
  ClipboardIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export default function ApiKeysTable({
  apiKeys = [],
  isLoading = false,
  error = null,
  visibleKeys = {},
  getDisplayKey,
  onToggleVisibility,
  onCopyKey,
  onEditKey,
  onDeleteKey,
  onCreateKey
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>API Keys</h2>
        <button
          onClick={onCreateKey}
          style={{ padding: '8px', background: '#f3f4f6', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
        >
          <PlusIcon style={{ width: '20px', height: '20px' }} />
        </button>
      </div>

      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
        The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
      </p>

      {error && (
        <div style={{ padding: '12px', marginBottom: '15px', backgroundColor: '#FEF2F2', color: '#B91C1C', borderRadius: '6px' }}>
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading API keys...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>NAME</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>TYPE</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>USAGE</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>KEY</th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                    No API keys found. Create your first key to get started.
                  </td>
                </tr>
              ) : (
                apiKeys.map(key => (
                  <tr key={key.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{key.name}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{key.type}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280' }}>{key.usage}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#6b7280', fontFamily: 'monospace' }}>
                      {getDisplayKey(key.key, key.id)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => onToggleVisibility(key)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                          aria-label={visibleKeys[key.id] ? "Hide API key" : "View API key"}
                        >
                          {visibleKeys[key.id] ? 
                            <EyeSlashIcon style={{ width: '20px', height: '20px' }} /> : 
                            <EyeIcon style={{ width: '20px', height: '20px' }} />
                          }
                        </button>
                        <button
                          onClick={() => onCopyKey(key.key)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                          aria-label="Copy API key"
                        >
                          <ClipboardIcon style={{ width: '20px', height: '20px' }} />
                        </button>
                        <button
                          onClick={() => onEditKey(key)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                          aria-label="Edit API key"
                        >
                          <PencilIcon style={{ width: '20px', height: '20px' }} />
                        </button>
                        <button
                          onClick={() => onDeleteKey(key.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                          aria-label="Delete API key"
                        >
                          <TrashIcon style={{ width: '20px', height: '20px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 