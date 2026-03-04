import { Router } from 'express'
import {
  getEstudiantes,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
} from '../controllers/estudiantesController'
import { requireRole } from '../middleware/roles'

const router = Router()

router.get('/', requireRole('admin', 'gerente'), getEstudiantes)
// admin may only create; updates reserved for gerente
router.post('/', requireRole('admin', 'gerente'), createEstudiante)
router.put('/:id', requireRole('gerente'), updateEstudiante)
router.delete('/:id', requireRole('gerente'), deleteEstudiante)

export default router
