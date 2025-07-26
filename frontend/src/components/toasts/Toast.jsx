import React, { useEffect, useState } from 'react';

const Toast = ({ toast, onRemove }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(showTimer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onRemove(toast.id), 300); 
  };

  const getStyles = () => {
    const base = {
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FFC107',
      info: '#2196F3',
    };
    return base[toast.type] || base.info;
  };

  return (
    <div
      className={`toast-wrapper ${show ? 'toast-show' : 'toast-hide'}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        backgroundColor: '#fff',
        borderLeft: `6px solid ${getStyles()}`,
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        padding: '12px 16px',
        minWidth: '300px',
        marginBottom: '0.5rem',
        transition: 'all 0.3s ease-in-out',
        transform: show ? 'translateX(0)' : 'translateX(120%)',
        opacity: show ? 1 : 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontSize: '1.3rem', marginRight: '10px' }}>
          {toast.type === 'success' && '✅'}
          {toast.type === 'error' && '❌'}
          {toast.type === 'warning' && '⚠️'}
          {toast.type === 'info' && 'ℹ️'}
        </span>
        <div style={{ flex: 1 }}>
          <strong style={{ display: 'block', fontSize: '1rem', color: '#333' }}>
            {toast.type === 'success' && 'Erfolgreich'}
            {toast.type === 'error' && 'Fehler'}
            {toast.type === 'warning' && 'Warnung'}
            {toast.type === 'info' && 'Information'}
          </strong>
          <span style={{ fontSize: '0.9rem', color: '#555' }}>{toast.message}</span>
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: '#888',
            marginLeft: '10px',
          }}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Toast;
