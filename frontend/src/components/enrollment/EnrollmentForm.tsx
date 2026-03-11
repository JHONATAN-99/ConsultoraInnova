import { useState } from "react"
import type { Estudiante, Area, Curso } from "../../types/models"

type EnrollmentFormProps = {
  estudiantes: Estudiante[]
  areas: Area[]
  cursos: Curso[]
  onCreateInscripcion: (data:{estudianteId:number,cursoId:number})=>void
}

export function EnrollmentForm({
  estudiantes,
  areas,
  cursos,
  onCreateInscripcion
}:EnrollmentFormProps){

  const [busquedaEstudiante,setBusquedaEstudiante] = useState("")
  const [estudianteSeleccionado,setEstudianteSeleccionado] = useState<number|null>(null)

  const [areaId,setAreaId] = useState<number|null>(null)

  const [busquedaCurso,setBusquedaCurso] = useState("")
  const [cursoId,setCursoId] = useState<number|null>(null)

  const estudiantesFiltrados = estudiantes.filter(e=>{
    const texto = busquedaEstudiante.toLowerCase()
    return (
      e.ci.toLowerCase().includes(texto) ||
      e.nombres.toLowerCase().includes(texto) ||
      e.apellidos.toLowerCase().includes(texto)
    )
  })

  const cursosArea = cursos.filter(c=>c.areaId === areaId)

  const cursosFiltrados = cursosArea.filter(c=>{
    return c.nombre.toLowerCase().includes(busquedaCurso.toLowerCase())
  })

  return(
    <section className="panel">

      <h2>Inscribir estudiante</h2>

      {/* BUSCAR ESTUDIANTE */}

      <div className="form-field">
        <label>Buscar estudiante 🔍</label>
        <input
          type="text"
          placeholder="Buscar por CI o nombre"
          value={busquedaEstudiante}
          onChange={(e)=>setBusquedaEstudiante(e.target.value)}
        />
      </div>

      {busquedaEstudiante && (
        <div className="table-wrapper">
          <table className="table">
            <tbody>
              {estudiantesFiltrados.map(e=>(
                <tr
                  key={e.id}
                  style={{cursor:"pointer"}}
                  onClick={()=>setEstudianteSeleccionado(e.id)}
                >
                  <td>{e.ci}</td>
                  <td>{e.nombres} {e.apellidos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AREA */}

      {estudianteSeleccionado && (
        <>
          <div className="form-field" style={{marginTop:"20px"}}>
            <label>Seleccionar área</label>
            <select onChange={e=>setAreaId(Number(e.target.value))}>
              <option value="">Seleccionar área</option>
              {areas.map(a=>(
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* BUSCAR CURSO */}

      {areaId && (
        <>
          <div className="form-field" style={{marginTop:"20px"}}>
            <label>Buscar curso 🔍</label>
            <input
              type="text"
              placeholder="Buscar curso"
              value={busquedaCurso}
              onChange={(e)=>setBusquedaCurso(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table className="table">
              <tbody>
                {cursosFiltrados.map(c=>(
                  <tr
                    key={c.id}
                    style={{cursor:"pointer"}}
                    onClick={()=>setCursoId(c.id)}
                  >
                    <td>{c.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* BOTON INSCRIBIR */}

      {estudianteSeleccionado && cursoId && (
        <div style={{marginTop:"20px"}}>
          <button
            onClick={()=>onCreateInscripcion({
              estudianteId: estudianteSeleccionado,
              cursoId: cursoId
            })}
          >
            Inscribir estudiante
          </button>
        </div>
      )}

    </section>
  )
}