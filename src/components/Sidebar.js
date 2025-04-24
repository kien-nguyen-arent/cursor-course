"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { 
  HomeIcon, 
  CodeBracketIcon, 
  BeakerIcon, 
  UserIcon, 
  DocumentTextIcon, 
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'

export default function Sidebar() {
  const [isPersonalMenuOpen, setIsPersonalMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Save sidebar state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true')
    }
  }, [])
  
  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', newState.toString())
  }

  const handleLogout = () => {
    signOut({ 
      callbackUrl: '/',
      redirect: true,
    })
    
    // Try to also logout from Google session by redirecting to Google logout URL
    try {
      // Clear all local storage items
      localStorage.clear()
      
      // Set a flag to indicate that we want a fresh login next time
      sessionStorage.setItem('forceLogin', 'true')
      
      // Optional: you could also attempt to directly logout from Google
      // window.open('https://accounts.google.com/logout', '_blank')
    } catch (error) {
      console.error('Error during logout cleanup:', error)
    }
  }

  const menuItems = [
    { name: 'Overview', href: '/dashboards', icon: HomeIcon, active: true },
    { name: 'API Playground', href: '/playground', icon: CodeBracketIcon },
    { name: 'Use Cases', href: '/use-cases', icon: BeakerIcon },
    { 
      name: 'My Account', 
      href: '/account', 
      icon: UserIcon, 
      hasDropdown: true,
      onClick: () => setIsAccountMenuOpen(!isAccountMenuOpen)
    },
    { 
      name: 'Documentation', 
      href: '/documentation', 
      icon: DocumentTextIcon, 
      external: true 
    },
    {
      name: 'Logout',
      icon: ArrowLeftOnRectangleIcon,
      onClick: handleLogout
    }
  ]

  return (
    <div style={{ 
      width: isCollapsed ? '80px' : '280px', 
      height: '100vh', 
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'white',
      transition: 'width 0.3s ease-in-out',
      overflow: 'hidden',
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ 
        padding: '20px',
        display: 'flex',
        justifyContent: isCollapsed ? 'center' : 'flex-start'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          whiteSpace: 'nowrap'
        }}>
          <div style={{ display: 'flex' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              background: '#4f46e5', 
              borderRadius: '2px',
              transform: 'rotate(45deg)',
              margin: '2px'
            }}></div>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              background: '#ef4444', 
              borderRadius: '2px',
              transform: 'rotate(45deg)',
              margin: '2px'
            }}></div>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              background: '#f97316', 
              borderRadius: '2px',
              transform: 'rotate(45deg)',
              margin: '2px'
            }}></div>
          </div>
          {!isCollapsed && (
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              marginLeft: '8px'
            }}>Arent Course</span>
          )}
        </div>
      </div>

      {/* Personal menu */}
      {!isCollapsed && (
        <div style={{ 
          margin: '20px',
          marginTop: '10px',
          marginBottom: '10px',
          padding: '10px',
          borderRadius: '8px',
          background: '#f3f4f6',
          cursor: 'pointer'
        }} onClick={() => setIsPersonalMenuOpen(!isPersonalMenuOpen)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: '#9333ea',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>K</div>
              <span>Personal</span>
            </div>
            <ChevronDownIcon style={{ width: '16px', height: '16px' }} />
          </div>
        </div>
      )}

      {/* Collapsed personal indicator */}
      {isCollapsed && (
        <div style={{ 
          margin: '10px auto',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#9333ea',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>K</div>
      )}

      {/* Navigation */}
      <nav style={{ 
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <ul style={{ 
          listStyle: 'none',
          padding: '0',
          margin: '0',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}>
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.onClick ? (
                <div 
                  onClick={item.onClick}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    padding: isCollapsed ? '16px 0' : '12px 20px',
                    color: item.active ? '#4f46e5' : '#6b7280',
                    background: item.active ? '#f3f4f6' : 'transparent',
                    borderLeft: item.active ? '3px solid #4f46e5' : '3px solid transparent',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    width: isCollapsed ? '100%' : 'auto'
                  }}>
                    <item.icon style={{ width: '20px', height: '20px' }} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isCollapsed && item.hasDropdown && (
                    <ChevronDownIcon style={{ width: '16px', height: '16px' }} />
                  )}
                  {!isCollapsed && item.external && (
                    <ArrowTopRightOnSquareIcon style={{ width: '16px', height: '16px' }} />
                  )}
                </div>
              ) : (
                <Link href={item.href}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    padding: isCollapsed ? '16px 0' : '12px 20px',
                    color: item.active ? '#4f46e5' : '#6b7280',
                    background: item.active ? '#f3f4f6' : 'transparent',
                    borderLeft: item.active ? '3px solid #4f46e5' : '3px solid transparent',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      width: isCollapsed ? '100%' : 'auto'
                    }}>
                      <item.icon style={{ width: '20px', height: '20px' }} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && item.hasDropdown && (
                      <ChevronDownIcon style={{ width: '16px', height: '16px' }} />
                    )}
                    {!isCollapsed && item.external && (
                      <ArrowTopRightOnSquareIcon style={{ width: '16px', height: '16px' }} />
                    )}
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User */}
      {!isCollapsed ? (
        <div style={{ 
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ 
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#9333ea',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>K</div>
          <div>Kien Nguyen</div>
          <div style={{ marginLeft: 'auto' }}>
            <ArrowTopRightOnSquareIcon style={{ width: '16px', height: '16px', color: '#6b7280' }} />
          </div>
        </div>
      ) : (
        <div style={{ 
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ 
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#9333ea',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>K</div>
        </div>
      )}
      
      {/* Toggle collapse button */}
      <button 
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          right: '-12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'white',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          zIndex: 10
        }}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRightIcon style={{ width: '14px', height: '14px' }} />
        ) : (
          <ChevronLeftIcon style={{ width: '14px', height: '14px' }} />
        )}
      </button>
    </div>
  )
} 