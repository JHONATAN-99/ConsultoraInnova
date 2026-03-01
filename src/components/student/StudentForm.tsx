import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import type { Curso } from '../../mockDb'

type StudentFormProps = {
  cursos: Curso[]
  onCreate: (payload: {
    nombre: string
    apellido: string
    email: string
    cursoId: number
    montoInicial: number
  }) => void
}

export function StudentForm({ cursos, onCreate }: StudentFormProps) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    cursoId: cursos[0]?.id.toString() ?? '',
    montoInicial: '',
  })

  // if cursos array is populated after mount, update selected cursoId
  useEffect(() => {
    if (cursos.length && !form.cursoId) {
      setForm((prev) => ({ ...prev, cursoId: cursos[0].id.toString() }))
    }
  }, [cursos, form.cursoId])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (
      !form.nombre.trim() ||
      !form.apellido.trim() ||
      !form.email.trim() ||
      !form.cursoId ||
      !form.montoInicial
    ) {
      return
    }

    const montoInicialNumber = Number(form.montoInicial)
    if (Number.isNaN(montoInicialNumber) || montoInicialNumber < 0) {
      return
    }

    onCreate({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim(),
      cursoId: Number(form.cursoId),
      montoInicial: montoInicialNumber,
    })

    setForm({
      nombre: '',
      apellido: '',
      email: '',
      cursoId: cursos[0]?.id.toString() ?? '',
      montoInicial: '',
    })
  }

  return (
    <section className="panel">
      <h2>Registrar estudiante</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del estudiante"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Apellido del estudiante"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="montoInicial">Monto inicial (efectivo)</label>
            <input
              id="montoInicial"
              name="montoInicial"
              type="number"
              min={0}
              step="0.01"
              value={form.montoInicial}
              onChange={handleChange}
              placeholder="Ej: 200"
              required
            />
          </div>
          <div className="form-field">
            <label>Precio del curso seleccionado</label>
            <input
              type="text"
              readOnly
              value={
                cursos.find((c) => c.id === Number(form.cursoId))
                  ? `$ ${
                      cursos.find((c) => c.id === Number(form.cursoId))!.precio.toFixed(2)
                    }`
                  : ''
              }
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="cursoId">Curso</label>
            <select
              id="cursoId"
              name="cursoId"
              value={form.cursoId}
              onChange={handleChange}
              required
            >
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">Guardar estudiante</button>
        </div>
      </form>
    </section>
  )
}

