import type { Area, Curso } from '../../mockDb'

type AreaListProps = {
  areas: Area[]
  cursos: Curso[]
  onDelete?: (area: Area) => void
}

export function AreaList({ areas, cursos, onDelete }: AreaListProps) {
  return (
    <div className="area-list">
      {areas.map((area) => {
        const count = cursos.filter((c) => c.areaId === area.id).length
        return (
          <div key={area.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{area.nombre}</strong> ({count} curso{count !== 1 ? 's' : ''})
            {onDelete && (
              <button
                type="button"
                style={{ marginLeft: '0.5rem' }}
                onClick={() => onDelete(area)}
              >
                Eliminar área
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
