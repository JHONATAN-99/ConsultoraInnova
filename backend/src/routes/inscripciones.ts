import { Router } from 'express'
import {
  getInscripciones,
  createInscripcion,
  updateInscripcion,
  deleteInscripcion,
} from '../controllers/inscripcionesController'
import { requireRole } from '../middleware/roles'

const router = Router()

// only administrador and gerente can view inscripciones
router.get('/', requireRole('administrador', 'gerente'), getInscripciones)
// only administrador can create inscripciones
router.post('/', requireRole('administrador'), createInscripcion)
// only administrador can update inscripciones (add notes, mark as complete)
router.put('/:id', requireRole('administrador'), updateInscripcion)
// only administrador can delete inscripciones
router.delete('/:id', requireRole('administrador'), deleteInscripcion)

export default router
