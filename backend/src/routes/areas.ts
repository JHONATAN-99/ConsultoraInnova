import { Router } from 'express'
import {
  getAreas,
  createArea,
  updateArea,
  deleteArea,
} from '../controllers/areasController'
import { requireRole } from '../middleware/roles'

const router = Router()

// any user can view areas
router.get('/', getAreas)
// only gerente or admin should be able to mutate
// restrict area creation to gerente only
router.post('/', requireRole('gerente'), createArea)
router.put('/:id', requireRole('gerente'), updateArea)
router.delete('/:id', requireRole('gerente'), deleteArea)

export default router
