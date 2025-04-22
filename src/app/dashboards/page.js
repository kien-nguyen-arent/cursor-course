"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

// Components
import Sidebar from "@/components/Sidebar";
import Notification from "@/components/Notification";
import PlanCard from "@/components/dashboard/PlanCard";
import ApiKeysTable from "@/components/dashboard/ApiKeysTable";
import CreateKeyModal from "@/components/dashboard/CreateKeyModal";
import EditKeyModal from "@/components/dashboard/EditKeyModal";

// Hooks
import useApiKeys from "@/hooks/useApiKeys";

export default function DashboardPage() {
  const router = useRouter();
  
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
  }, [fetchApiKeys]);
  
  // Handle dark mode toggle
  const toggleDarkMode = useCallback(() => {
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
  }, []);
  
  // Handle API Key actions
  const handleCreateKey = useCallback(async (name, type, limitUsage, limit) => {
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
        message: `Failed to create API key: ${result.error}`,
        type: 'error'
      });
    }
  }, [createApiKey]);
  
  const handleEditKey = useCallback((key) => {
    setEditKey(key);
    setIsEditModalOpen(true);
  }, []);
  
  const handleSaveEdit = useCallback(async (id, name) => {
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
        message: `Failed to update API key: ${result.error}`,
        type: 'error'
      });
    }
  }, [updateApiKey]);
  
  const handleDeleteKey = useCallback(async (id) => {
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
        message: `Failed to delete API key: ${result.error}`,
        type: 'error'
      });
    }
  }, [deleteApiKey]);
  
  const handleCopyKey = useCallback((key) => {
    navigator.clipboard.writeText(key);
    setNotification({
      visible: true,
      message: 'Copied API Key to clipboard',
      type: 'success'
    });
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                Pages / Overview
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Overview</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                color: '#10b981', 
                background: 'rgba(16, 185, 129, 0.1)', 
                padding: '6px 10px', 
                borderRadius: '999px', 
                fontSize: '14px' 
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                Operational
              </div>
              <button 
                onClick={toggleDarkMode} 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? 
                  <SunIcon style={{ width: '20px', height: '20px' }} /> : 
                  <MoonIcon style={{ width: '20px', height: '20px' }} />
                }
              </button>
            </div>
          </header>

          {/* Plan Card */}
          <div style={{ marginBottom: '30px' }}>
            <PlanCard 
              planName="Researcher"
              usage={0}
              limit={1000}
            />
          </div>

          {/* API Keys Section */}
          <div style={{ marginBottom: '30px' }}>
            <ApiKeysTable 
              apiKeys={apiKeys}
              isLoading={isLoading}
              error={error}
              visibleKeys={visibleKeys}
              getDisplayKey={getDisplayKey}
              onToggleVisibility={toggleKeyVisibility}
              onCopyKey={handleCopyKey}
              onEditKey={handleEditKey}
              onDeleteKey={handleDeleteKey}
              onCreateKey={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>
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
  );
} 