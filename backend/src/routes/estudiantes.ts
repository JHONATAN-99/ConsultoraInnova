import { Router } from 'express'
import {
  getEstudiantes,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  getEstudianteByCI,
} from '../controllers/estudiantesController'
import { requireRole } from '../middleware/roles'

const router = Router()

router.get('/', requireRole('administrador', 'gerente'), getEstudiantes)
// Public route for student consultation by CI
router.get('/ci/:ci', getEstudianteByCI)
// administrador may create; updates and deletes reserved for gerente
router.post('/', requireRole('administrador'), createEstudiante)
router.put('/:id', requireRole('gerente'), updateEstudiante)
router.delete('/:id', requireRole('gerente'), deleteEstudiante)

export default router
