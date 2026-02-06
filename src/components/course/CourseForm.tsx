import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Curso } from '../../mockDb'

type CourseFormProps = {
  onCreate: (payload: {
    nombre: string
    descripcion: string
    precio: number
    duracionSemanas: number
  }) => void
}

export function CourseForm({ onCreate }: CourseFormProps) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracionSemanas: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.descripcion.trim() || !form.precio || !form.duracionSemanas) {
      return
    }

    const precioNumber = Number(form.precio)
    const duracionNumber = Number(form.duracionSemanas)

    if (Number.isNaN(precioNumber) || precioNumber <= 0 || Number.isNaN(duracionNumber) || duracionNumber <= 0) {
      return
    }

    onCreate({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: precioNumber,
      duracionSemanas: duracionNumber,
    })

    setForm({
      nombre: '',
      descripcion: '',
      precio: '',
      duracionSemanas: '',
    })
  }

  return (
    <section className="panel">
      <h2>Crear curso</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="nombreCurso">Nombre del curso</label>
            <input
              id="nombreCurso"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Desarrollo Web con React"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="precioCurso">Precio (USD)</label>
            <input
              id="precioCurso"
              name="precio"
              type="number"
              min={0}
              step="0.01"
              value={form.precio}
              onChange={handleChange}
              placeholder="Ej: 500"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="duracionSemanas">Duración (semanas)</label>
            <input
              id="duracionSemanas"
              name="duracionSemanas"
              type="number"
              min={1}
              step="1"
              value={form.duracionSemanas}
              onChange={handleChange}
              placeholder="Ej: 8"
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="descripcionCurso">Descripción</label>
          <textarea
            id="descripcionCurso"
            name="descripcion"
            rows={3}
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción breve del contenido del curso"
            style={{ resize: 'vertical' }}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">Guardar curso</button>
        </div>
      </form>
    </section>
  )
}

