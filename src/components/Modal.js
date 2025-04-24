"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import "../styles/modal.css";

/**
 * Modal component that displays content in a dialog box with animations
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  initialFocusRef,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  size = "medium", // new prop: small, medium, large
  position = "center", // new prop: center, top
}) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const nodeRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  
  // Mark as opened when the modal becomes visible
  useEffect(() => {
    if (isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  }, [isOpen, hasBeenOpened]);

  // Handle clicking on the overlay to close the modal
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  // Handle keyboard events using useCallback
  const handleKeyDown = useCallback((e) => {
    // Close on escape key press
    if (closeOnEsc && e.key === 'Escape') {
      onClose();
    }

    // Trap focus within the modal
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    }
  }, [closeOnEsc, onClose]);

  // Set up focus trap and key handlers
  useEffect(() => {
    if (isOpen) {
      // Find all focusable elements
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements?.length) {
        firstFocusableRef.current = focusableElements[0];
        lastFocusableRef.current = focusableElements[focusableElements.length - 1];

        // Focus the specified element or the first focusable element
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else {
          firstFocusableRef.current.focus();
        }
      }

      // Add event listener for key events
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, initialFocusRef, handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Only attempt to render the portal if we're in a browser context
  if (typeof window === 'undefined' && !hasBeenOpened) {
    return null;
  }

  // Calculate modal container class based on size prop
  const sizeClass = size === "small" ? "modal-container-sm" : 
                   size === "large" ? "modal-container-lg" :
                   "";
  
  // Calculate position class
  const positionClass = position === "top" ? "modal-position-top" : "";

  // Render the modal portal
  return createPortal(
    <CSSTransition
      in={isOpen}
      timeout={200}
      classNames="modal"
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div 
        className="modal-overlay" 
        ref={(node) => {
          overlayRef.current = node;
          nodeRef.current = node;
        }}
        onClick={handleOverlayClick}
        aria-modal="true"
        role="dialog"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <div 
          className={`modal-container ${sizeClass} ${positionClass}`} 
          ref={modalRef}
        >
          <div className="modal-header">
            {title && <h2 className="modal-title" id="modal-title">{title}</h2>}
            <button 
              className="modal-close-btn" 
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="modal-content">
            {children}
          </div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </CSSTransition>,
    document.body
  );
};

export default Modal; 