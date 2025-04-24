'use client'

import {
  ClipboardIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

export default function ApiKeysTable({
  apiKeys = [],
  isLoading = false,
  error = null,
  visibleKeys = {},
  getDisplayKey = (key) => key ? `${key.substring(0, 3)}...${key.substring(key.length - 3)}` : '',
  onViewKey,
  onCopyKey,
  onEditKey,
  onDeleteKey,
  formatDate,
  formatTime
}) {
  // Safe function wrappers to prevent errors
  const handleViewKey = (key) => {
    try {
      if (onViewKey && typeof onViewKey === 'function') {
        onViewKey(key);
      }
    } catch (error) {
      console.error('Error in view key handler:', error);
    }
  };

  const handleCopyKey = (key) => {
    try {
      if (onCopyKey && typeof onCopyKey === 'function' && key) {
        onCopyKey(key);
      }
    } catch (error) {
      console.error('Error in copy key handler:', error);
    }
  };

  const handleEditKey = (key) => {
    try {
      if (onEditKey && typeof onEditKey === 'function' && key) {
        onEditKey(key);
      }
    } catch (error) {
      console.error('Error in edit key handler:', error);
    }
  };

  const handleDeleteKey = (id) => {
    try {
      if (onDeleteKey && typeof onDeleteKey === 'function' && id) {
        onDeleteKey(id);
      }
    } catch (error) {
      console.error('Error in delete key handler:', error);
    }
  };

  const safeGetDisplayKey = (key, id) => {
    try {
      if (getDisplayKey && typeof getDisplayKey === 'function') {
        return getDisplayKey(key, id);
      }
      return key ? `${key.substring(0, 3)}...${key.substring(key.length - 3)}` : '';
    } catch (error) {
      console.error('Error in getDisplayKey:', error);
      return key ? `${key.substring(0, 3)}...${key.substring(key.length - 3)}` : '';
    }
  };

  return (
    <div>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
        API keys are used to authenticate your requests. Keep your keys secure - don&apos;t share them in public areas.
      </p>

      {error && (
        <div style={{ padding: '12px', marginBottom: '15px', backgroundColor: '#FEF2F2', color: '#B91C1C', borderRadius: '6px' }}>
          {error}
        </div>
      )}
      
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
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  Loading API keys...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#b91c1c' }}>
                  {error}
                </td>
              </tr>
            ) : apiKeys.length === 0 ? (
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
                    {safeGetDisplayKey(key.key, key.id)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => handleViewKey(key)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                        aria-label={(visibleKeys && visibleKeys[key.id]) ? "Hide API key" : "View API key"}
                      >
                        {(visibleKeys && visibleKeys[key.id]) ? 
                          <EyeSlashIcon style={{ width: '20px', height: '20px' }} /> : 
                          <EyeIcon style={{ width: '20px', height: '20px' }} />
                        }
                      </button>
                      <button
                        onClick={() => handleCopyKey(key.key)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                        aria-label="Copy API key"
                      >
                        <ClipboardIcon style={{ width: '20px', height: '20px' }} />
                      </button>
                      <button
                        onClick={() => handleEditKey(key)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                        aria-label="Edit API key"
                      >
                        <PencilIcon style={{ width: '20px', height: '20px' }} />
                      </button>
                      <button
                        onClick={() => handleDeleteKey(key.id)}
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
    </div>
  )
} 