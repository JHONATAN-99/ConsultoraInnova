import { Router } from 'express'
import {
  getCursos,
  createCurso,
  updateCurso,
  deleteCurso,
} from '../controllers/cursosController'
import { requireRole } from '../middleware/roles'

const router = Router()

router.get('/', getCursos)
// only gerente may add or change course metadata
router.post('/', requireRole('gerente'), createCurso)
router.put('/:id', requireRole('gerente'), updateCurso)
router.delete('/:id', requireRole('gerente'), deleteCurso)

export default router
