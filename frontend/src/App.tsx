import { useState, useEffect } from 'react'
import { healthCheck } from './services/api'
import './App.css'

interface HealthStatus {
  status: string
  timestamp: string
  service: string
  version: string
}

function App() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await healthCheck()
        setHealthStatus(data)
      } catch (err) {
        setError('Failed to connect to backend. Make sure the backend server is running on http://localhost:3333')
        console.error('Health check error:', err)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  const retryConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await healthCheck()
      setHealthStatus(data)
    } catch (err) {
      setError('Failed to connect to backend. Make sure the backend server is running on http://localhost:3333')
      console.error('Health check error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🏌️ Golf Coach Booking System</h1>
          <p className="text-muted-foreground">Frontend ↔ Backend Connection Test</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Backend Health Check</h2>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {error && !loading && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-destructive font-medium mb-2">❌ Connection Failed</p>
              <p className="text-sm text-destructive/80">{error}</p>
              <button
                onClick={retryConnection}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
              >
                Retry Connection
              </button>
            </div>
          )}

          {healthStatus && !loading && !error && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-3">
              <p className="text-green-600 dark:text-green-400 font-medium text-lg">
                ✅ Connection Successful!
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Status:</p>
                  <p className="font-medium capitalize">{healthStatus.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Service:</p>
                  <p className="font-medium">{healthStatus.service}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Version:</p>
                  <p className="font-medium">{healthStatus.version}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Timestamp:</p>
                  <p className="font-medium">{new Date(healthStatus.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={retryConnection}
                className="mt-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition"
              >
                Refresh Status
              </button>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-2">
          <h3 className="text-lg font-semibold">Setup Status</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Frontend (React + Vite + TypeScript)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Tailwind CSS configured</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Axios API client configured</span>
            </li>
            <li className="flex items-center gap-2">
              <span className={healthStatus ? "text-green-500" : "text-yellow-500"}>
                {healthStatus ? "✓" : "⋯"}
              </span>
              <span>Backend (AdonisJS 6) - Port 3333</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-500">⋯</span>
              <span>PostgreSQL Database</span>
            </li>
          </ul>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Next Steps:</p>
          <p className="mt-2">
            1. Start PostgreSQL database<br />
            2. Run migrations: <code className="bg-muted px-2 py-1 rounded">npm run migration:run</code><br />
            3. Start developing features!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
