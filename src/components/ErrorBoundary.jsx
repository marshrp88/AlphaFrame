import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() { return { hasError: true }; }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.href = '/onboarding'}>Restart Onboarding</button>
          <button onClick={() => window.location.href = '/dashboard'}>Return to Dashboard</button>
          <button onClick={() => alert('Report sent!')}>Report Error</button>
        </div>
      );
    }
    return this.props.children;
  }
} 