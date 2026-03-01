import { Router } from 'express'
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
} from '../controllers/solicitudesController'

const router = Router()

router.get('/', getSolicitudes)
router.post('/', createSolicitud)
router.put('/:id', updateSolicitud)

export default router
