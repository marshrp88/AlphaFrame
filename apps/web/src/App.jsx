import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import AlphaPro from './pages/AlphaPro'
import PrivateRoute from './components/PrivateRoute'

function App() {
  console.log('Debug: App component rendering');
  return (
    <div style={{ 
      backgroundColor: 'white',
      color: '#213547',
      minHeight: '100vh'
    }}>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <Link to="/" style={{ marginRight: '1rem', color: '#646cff' }}>Home</Link>
        <Link to="/alphapro" style={{ color: '#646cff' }}>AlphaPro</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1 style={{ padding: '2rem' }}>✅ AlphaFrame Home is Rendering</h1>} />
        <Route path="/alphapro" element={<PrivateRoute><AlphaPro /></PrivateRoute>} />
      </Routes>
    </div>
  )
}

export default App
