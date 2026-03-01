import { Router } from 'express'
import { getEstudiantes, createEstudiante, updateEstudiante } from '../controllers/estudiantesController'

const router = Router()

router.get('/', getEstudiantes)
router.post('/', createEstudiante)
router.put('/:id', updateEstudiante)

export default router
