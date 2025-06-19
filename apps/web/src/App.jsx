import React, { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Button } from './components/ui/Button'
import { useAppStore } from './store/useAppStore'
import Home from './pages/Home'
import About from './pages/About'
import RulesPage from './pages/RulesPage'
import { config } from './lib/config'
import PrivateRoute from './components/PrivateRoute'
import AlphaPro from './pages/AlphaPro'

function HomeWithDemo() {
  // Access counter value and actions from Zustand store
  const counter = useAppStore((state) => state.counter)
  const increment = useAppStore((state) => state.increment)
  const reset = useAppStore((state) => state.reset)

  // Use the API URL from the config module
  const apiUrl = config.apiUrl

  // State for API fetch
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch data from the API when the component mounts
  useEffect(() => {
    if (!apiUrl) return
    setLoading(true)
    setError(null)
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error('API error: ' + res.status)
        return res.json()
      })
      .then((data) => setApiData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [apiUrl])

  return (
    <div>
      <Home />
      {/* Display the counter value */}
      <h2>Counter: {counter}</h2>
      {/* Button to increment the counter */}
      <button onClick={increment}>Increment</button>
      {/* Button to reset the counter */}
      <button onClick={reset}>Reset</button>
      {/* Existing test button */}
      <Button />
      {/* Display the API URL or a warning if missing */}
      <div style={{ marginTop: '2rem' }}>
        <strong>API URL:</strong> {apiUrl ? apiUrl : <span style={{color: 'red'}}>Not set! Please define VITE_PUBLIC_API_URL in your .env file.</span>}
      </div>
      {/* API fetch result */}
      <div style={{ marginTop: '2rem' }}>
        <strong>API Test:</strong>
        {apiUrl ? (
          loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{color: 'red'}}>Error: {error}</div>
          ) : apiData ? (
            <pre style={{textAlign: 'left', background: '#222', color: '#fff', padding: '1em', borderRadius: '8px'}}>
              {typeof apiData === 'string' ? apiData : JSON.stringify(apiData, null, 2)}
            </pre>
          ) : (
            <div>No data received.</div>
          )
        ) : null}
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      {/* Navigation links */}
      <nav style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/about">About</Link>
        <Link to="/rules">Rules</Link>
        <Link to="/pro" style={{ marginLeft: '1rem', color: 'purple' }}>AlphaPro</Link>
      </nav>
      {/* Route definitions */}
      <Routes>
        <Route path="/" element={<HomeWithDemo />} />
        <Route path="/about" element={<About />} />
        <Route path="/rules" element={<RulesPage />} />
        {/* Protected AlphaPro route */}
        <Route path="/pro" element={<PrivateRoute><AlphaPro /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default App
