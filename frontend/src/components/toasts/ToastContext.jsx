import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

/**
 * Custom hook to access the toast context.
 * @returns {Object} The context value containing toasts and methods to manage them.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Provider component for the toast context.
 * @param {*} param0 
 * @returns {JSX.Element} The provider component wrapping its children. 
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    console.log('Removing toast from context, ID:', id);
    setToasts(prev => {
      const updated = prev.filter(toast => toast.id !== id);
      console.log('Toasts before removal:', prev.length, 'after removal:', updated.length);
      return updated;
    });
  }, []);

  /**
   * Adds a new toast message.
   * @param {string} message The message to display in the toast.
   * @param {string} type The type of toast (success, error, warning, info).
   * @param {number} duration The duration in milliseconds before the toast disappears. Default is 5000ms.
   * @returns {number} The ID of the created toast.
   */
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration
    };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const error = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const warning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  const info = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
