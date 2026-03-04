import { Router } from 'express'
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
} from '../controllers/solicitudesController'
import { requireRole } from '../middleware/roles'

const router = Router()

router.get('/', requireRole('admin', 'gerente'), getSolicitudes)
router.post('/', createSolicitud)
// only gerente can change status of solicitudes
router.put('/:id', requireRole('gerente'), updateSolicitud)
router.delete('/:id', requireRole('gerente'), deleteSolicitud)

export default router
