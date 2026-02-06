import { useState, type FormEvent } from 'react'

type LoginPageProps = {
  onLoginSuccess: () => void
}

const MOCK_USER = {
  username: 'admin',
  password: '1234',
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      setError('')
      onLoginSuccess()
      return
    }

    setError('Credenciales incorrectas. Prueba con admin / 1234.')
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <header className="login-header">
          <h1>Iniciar sesión</h1>
          <p className="login-subtitle">
            Accede al panel de control de estudiantes de la institución.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="form-actions">
            <button type="submit">Entrar</button>
          </div>
        </form>

        <p className="login-hint">
          <strong>Demo:</strong> usuario <code>admin</code> · contraseña <code>1234</code>
        </p>
      </div>
    </div>
  )
}

