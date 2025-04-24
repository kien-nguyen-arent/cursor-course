"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Components
import Sidebar from "@/components/Sidebar";
import Notification from "@/components/Notification";
import PlanCard from "@/components/dashboard/PlanCard";
import ApiKeysTable from "@/components/dashboard/ApiKeysTable";
import CreateKeyModal from "@/components/dashboard/CreateKeyModal";
import EditKeyModal from "@/components/dashboard/EditKeyModal";

// Hooks
import useApiKeys from "@/hooks/useApiKeys";

// Separate client component that uses useRouter
function DashboardContent() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editKey, setEditKey] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState({
    visible: false,
    message: '',
    type: 'success'
  });
  
  // API keys hook
  const {
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
  } = useApiKeys();
  
  // Check for dark mode and sidebar state on component mount
  useEffect(() => {
    try {
      // Check for saved dark mode preference
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
      
      // Apply dark mode class to body
      if (savedDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      
      // Check sidebar state
      const savedSidebarState = localStorage.getItem('sidebarCollapsed') === 'true';
      setIsSidebarCollapsed(savedSidebarState);
      
      // Add event listener for sidebar changes
      const handleSidebarChange = () => {
        const currentState = localStorage.getItem('sidebarCollapsed') === 'true';
        setIsSidebarCollapsed(currentState);
      };
      
      window.addEventListener('storage', handleSidebarChange);
      
      // Fetch API keys
      fetchApiKeys();
      
      return () => {
        window.removeEventListener('storage', handleSidebarChange);
      };
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [fetchApiKeys]);
  
  // Handle dark mode toggle
  const toggleDarkMode = useCallback(() => {
    try {
      setDarkMode(prevMode => {
        const newMode = !prevMode;
        localStorage.setItem('darkMode', newMode.toString());
        
        if (newMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
        
        return newMode;
      });
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  }, []);
  
  // Handle function wrapper to catch errors
  const safeHandler = useCallback((handler) => {
    return (...args) => {
      try {
        return handler(...args);
      } catch (error) {
        console.error('Error in handler:', error);
        setNotification({
          visible: true,
          message: 'An error occurred during operation',
          type: 'error'
        });
      }
    };
  }, []);
  
  // Handle API Key actions - wrapped with safeHandler
  const handleCreateKey = useCallback(async (name, type, limitUsage, limit) => {
    try {
      const result = await createApiKey(name, type, limitUsage, limit);
      
      if (result.success) {
        setNotification({
          visible: true,
          message: 'API key created successfully',
          type: 'success'
        });
      } else {
        setNotification({
          visible: true,
          message: `Failed to create API key: ${result.error || 'Unknown error'}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Create key error:', error);
      setNotification({
        visible: true,
        message: 'An error occurred while creating the API key',
        type: 'error'
      });
    }
  }, [createApiKey]);
  
  const handleEditKey = useCallback((key) => {
    try {
      if (key) {
        setEditKey(key);
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error('Edit key error:', error);
    }
  }, []);
  
  const handleSaveEdit = useCallback(async (id, name) => {
    try {
      if (!id) return;
      
      const result = await updateApiKey(id, name);
      
      if (result.success) {
        setNotification({
          visible: true,
          message: 'API key updated successfully',
          type: 'success'
        });
      } else {
        setNotification({
          visible: true,
          message: `Failed to update API key: ${result.error || 'Unknown error'}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Save edit error:', error);
      setNotification({
        visible: true,
        message: 'An error occurred while updating the API key',
        type: 'error'
      });
    }
  }, [updateApiKey]);
  
  const handleDeleteKey = useCallback(async (id) => {
    try {
      if (!id) return;
      
      const result = await deleteApiKey(id);
      
      if (result.success) {
        setNotification({
          visible: true,
          message: 'API key deleted successfully',
          type: 'error' // Using error type for red color
        });
      } else {
        setNotification({
          visible: true,
          message: `Failed to delete API key: ${result.error || 'Unknown error'}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Delete key error:', error);
      setNotification({
        visible: true,
        message: 'An error occurred while deleting the API key',
        type: 'error'
      });
    }
  }, [deleteApiKey]);
  
  const handleCopyKey = useCallback((key) => {
    try {
      if (!key) return;
      
      navigator.clipboard.writeText(key);
      setNotification({
        visible: true,
        message: 'Copied API Key to clipboard',
        type: 'success'
      });
    } catch (error) {
      console.error('Copy key error:', error);
      setNotification({
        visible: true,
        message: 'Failed to copy API key to clipboard',
        type: 'error'
      });
    }
  }, []);
  
  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, visible: false }));
  }, []);

  // Format helper functions
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

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
        marginLeft: isSidebarCollapsed ? '80px' : '280px', 
        padding: '20px',
        transition: 'margin-left 0.3s ease-in-out'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Dashboard</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={toggleDarkMode}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                color: '#6b7280'
              }}
            >
              {darkMode ? (
                <SunIcon style={{ width: '20px', height: '20px' }} />
              ) : (
                <MoonIcon style={{ width: '20px', height: '20px' }} />
              )}
            </button>
            
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={40}
                height={40}
                style={{ borderRadius: '50%' }}
              />
            ) : (
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: '#4361EE',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
        </div>

        {/* Plan Info Card */}
        <div style={{ marginBottom: '32px' }}>
          <PlanCard />
        </div>

        {/* API Keys Section */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>API Keys</h2>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              style={{ 
                background: '#4361EE', 
                color: 'white', 
                padding: '8px 16px', 
                border: 'none', 
                borderRadius: '6px', 
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Create new API key
            </button>
          </div>

          <ApiKeysTable 
            apiKeys={apiKeys || []}
            isLoading={isLoading}
            error={error}
            visibleKeys={visibleKeys || {}}
            onCopyKey={handleCopyKey}
            onDeleteKey={handleDeleteKey}
            onViewKey={toggleKeyVisibility || (() => {})}
            onEditKey={handleEditKey}
            formatDate={formatDate}
            formatTime={formatTime}
            getDisplayKey={getDisplayKey || ((key) => key ? `${key.substring(0, 3)}...${key.substring(key.length - 3)}` : '')}
          />
        </div>

        {/* Modals */}
        <CreateKeyModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateKey={handleCreateKey}
        />
        
        <EditKeyModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaveEdit={handleSaveEdit}
          keyData={editKey}
        />
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
} 