import './App.css'
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import StudentApp from './pages/StudentApp'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return <StudentApp onLogout={() => setIsAuthenticated(false)} />
}

export default App
