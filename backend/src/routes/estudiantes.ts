import { Router } from 'express'
import { getEstudiantes, createEstudiante } from '../controllers/estudiantesController'

const router = Router()

router.get('/', getEstudiantes)
router.post('/', createEstudiante)

export default router
