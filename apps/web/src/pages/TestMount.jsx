import React from 'react';

export default function TestMount() {
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