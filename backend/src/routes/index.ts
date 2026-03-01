import { Router } from 'express'
import cursosRouter from './cursos'
import estudiantesRouter from './estudiantes'

const router = Router()

router.use('/cursos', cursosRouter)
router.use('/estudiantes', estudiantesRouter)

export default router
