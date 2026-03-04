import { Router } from 'express'
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
} from '../controllers/solicitudesController'
import { requireRole } from '../middleware/roles'

const router = Router()

// all authenticated roles should be able to list solicitudes (filtering done client‑side for users)
router.get('/', requireRole('admin', 'gerente', 'user'), getSolicitudes)
router.post('/', createSolicitud)
// only gerente can change status of solicitudes
router.put('/:id', requireRole('gerente'), updateSolicitud)
router.delete('/:id', requireRole('gerente'), deleteSolicitud)

export default router
