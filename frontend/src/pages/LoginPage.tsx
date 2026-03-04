import { useState, type FormEvent } from 'react'

type LoginPageProps = {
  onLoginSuccess: (role: 'admin' | 'user' | 'gerente', email: string) => void
}

type AuthResponse = {
  id: number
  email: string
  role: 'admin' | 'user' | 'gerente'
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState<'admin' | 'user' | 'gerente'>('user')
  const [error, setError] = useState('')

  const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/`;
  }

  const handleAuth = async (endpoint: '/login' | '/register') => {
    try {
      const body: any = { email, password }
      if (endpoint === '/register') body.role = role
      const res = await fetch(`/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data: AuthResponse | { error: string } = await res.json()
      if (!res.ok) {
        setError((data as any).error || 'Error inesperado')
        return null
      }
      return data as AuthResponse
    } catch (err) {
      setError('Error de red')
      return null
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'register') {
      if (password !== confirm) {
        setError('Las contraseñas no coinciden')
        return
      }
      const user = await handleAuth('/register')
      if (user) {
        setCookie('role', user.role)
        setCookie('email', user.email)
        onLoginSuccess(user.role, user.email)
      }
    } else {
      const user = await handleAuth('/login')
      if (user) {
        setCookie('role', user.role)
        setCookie('email', user.email)
        onLoginSuccess(user.role, user.email)
      }
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <header className="login-header">
          <h1>{mode === 'login' ? 'Iniciar sesión' : 'Registrar usuario'}</h1>
          <p className="login-subtitle">
            Accede al panel de control de la institución.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              required
            />
          </div>

          {mode === 'register' && (
            <div className="form-field">
              <label htmlFor="confirm">Confirmar contraseña</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••"
                required
              />
            </div>
          )}

          <div className="form-field">
            <label>Rol</label>
            <div className="role-options">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                />{' '}
                Estudiante
              </label>
              <label style={{ marginLeft: '1rem' }}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                />{' '}
                Administrador
              </label>
              <label style={{ marginLeft: '1rem' }}>
                <input
                  type="radio"
                  name="role"
                  value="gerente"
                  checked={role === 'gerente'}
                  onChange={() => setRole('gerente')}
                />{' '}
                Gerente
              </label>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="form-actions">
            <button type="submit">
              {mode === 'login' ? 'Entrar' : 'Registrar'}
            </button>
          </div>
        </form>

        <p className="login-hint">
          <strong>Demo:</strong> admin@demo.com / 1234 (administrador) o user@demo.com / 1234 (estudiante)
          {/* el rol gerente no se crea por demo */}
        </p>

        <div className="login-footer">
          {mode === 'login' ? (
            <p>
              ¿No tienes cuenta?{' '}
              <button type="button" onClick={() => setMode('register')}>
                Regístrate
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => setMode('login')}>
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

