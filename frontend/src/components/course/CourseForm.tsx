import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Area } from '../../mockDb'

type CourseFormProps = {
  onSubmit: (payload: {
    id?: number
    nombre: string
    descripcion: string
    precio: number
    duracionSemanas: number
    areaId?: number
  }) => void
  areas?: Area[]
  initialData?: {
    id: number
    nombre: string
    descripcion: string
    precio: number
    duracionSemanas?: number
    areaId?: number
  }
  onCancel?: () => void
}

export function CourseForm({ onSubmit, initialData, onCancel, areas }: CourseFormProps) {
  const [form, setForm] = useState({
    nombre: initialData?.nombre ?? '',
    descripcion: initialData?.descripcion ?? '',
    precio: initialData?.precio.toString() ?? '',
    duracionSemanas: initialData?.duracionSemanas?.toString() ?? '',
    areaId: initialData?.areaId ?? undefined,
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

    onSubmit({
      id: initialData?.id,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: precioNumber,
      duracionSemanas: duracionNumber,
      areaId: form.areaId,
    })

    setForm({
      nombre: '',
      descripcion: '',
      precio: '',
      duracionSemanas: '',
      areaId: undefined,
    })
    if (onCancel) onCancel()
  }

  return (
    <section className="panel">
      <h2>{initialData ? 'Editar curso' : 'Crear curso'}</h2>
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

        {areas && areas.length > 0 && (
          <div className="form-field">
            <label htmlFor="area">Área</label>
            <select
              id="area"
              name="areaId"
              value={form.areaId ?? ''}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  areaId: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
            >
              <option value="">-- ninguna --</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

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
          <button type="submit">{initialData ? 'Actualizar curso' : 'Guardar curso'}</button>
          {initialData && onCancel && (
            <button type="button" onClick={onCancel} style={{ marginLeft: '0.5rem' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

