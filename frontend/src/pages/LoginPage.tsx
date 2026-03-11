import { useState, type FormEvent } from "react";

type LoginPageProps = {
  onLoginSuccess: (role: "administrador" | "gerente", email: string) => void;
};

type AuthResponse = {
  id: number;
  email: string;
  role: "administrador" | "gerente";
};

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/`;
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse | { error: string } = await res.json();

      if (!res.ok) {
        setError((data as any).error || "Error inesperado");
        return null;
      }

      return data as AuthResponse;
    } catch {
      setError("Error de red");
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const user = await handleLogin();

    if (user) {
      setCookie("role", user.role);
      setCookie("email", user.email);
      onLoginSuccess(user.role, user.email);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <header className="login-header">
          <h1>Iniciar sesión</h1>
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
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="form-actions">
            <button type="submit">Entrar</button>
          </div>
        </form>

        <p className="login-hint">
          <strong>Demo:</strong> admin@demo.com / 1234 (administrador) o
          gerente@demo.com / 1234 (gerente)
        </p>

        <div className="login-footer">
          <p>Contacta al administrador del sistema si no tienes acceso.</p>
        </div>
      </div>
    </div>
  );
}
