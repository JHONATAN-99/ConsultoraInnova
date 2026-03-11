import { Router } from 'express'
import {
  getPagos,
  getPagosByInscripcion,
  createPago,
  updatePago,
  deletePago,
} from '../controllers/pagosController'
import { requireRole } from '../middleware/roles'

const router = Router()

// only administrador and gerente can view pagos
router.get('/', requireRole('administrador', 'gerente'), getPagos)
// only administrador can view pagos by inscripcion
router.get('/inscripcion/:inscripcionId', requireRole('administrador', 'gerente'), getPagosByInscripcion)
// only administrador can create pagos
router.post('/', requireRole('administrador'), createPago)
// only administrador can update pagos
router.put('/:id', requireRole('administrador'), updatePago)
// only administrador can delete pagos
router.delete('/:id', requireRole('administrador'), deletePago)

export default router
