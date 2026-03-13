import { useState } from "react";

export default function Consulta() {
  const [ci, setCi] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ci.trim()) return;

    window.location.href = `/estudiante/${ci}`;
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <header className="login-header">
          <h1>Consulta de estudiante</h1>
          <p className="login-subtitle">
            Ingrese su carnet de identidad para consultar sus cursos
          </p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label>Carnet de Identidad</label>

            <input
              type="text"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              placeholder="Ej: 7356004"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit">Consultar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
