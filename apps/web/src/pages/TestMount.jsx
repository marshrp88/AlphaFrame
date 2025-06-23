import React from 'react';

export default function TestMount() {
  console.log('[TestMount] Component rendered');
  console.log('[TestMount] Environment:', import.meta.env.VITE_APP_ENV);
  console.log('[TestMount] Timestamp:', new Date().toISOString());
  
  return (
    <div 
      data-testid="mount-check"
      style={{
        background: 'lime',
        border: '3px solid red',
        padding: '20px',
        margin: '20px',
        fontSize: '18px',
        fontWeight: 'bold'
      }}
    >
      Mounted successfully at {new Date().toISOString()}
    </div>
  );
} 