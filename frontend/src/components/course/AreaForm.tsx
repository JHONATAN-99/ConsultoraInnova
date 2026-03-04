import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Area } from '../../mockDb'

type AreaFormProps = {
  onSubmit: (payload: { nombre: string }) => void
}

export function AreaForm({ onSubmit }: AreaFormProps) {
  const [nombre, setNombre] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    onSubmit({ nombre: nombre.trim() })
    setNombre('')
  }

  return (
    <form className="form" onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <div className="form-field">
        <label htmlFor="nombreArea">Nombre del área</label>
        <input
          id="nombreArea"
          name="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Desarrollo web"
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit">Crear área</button>
      </div>
    </form>
  )
}
