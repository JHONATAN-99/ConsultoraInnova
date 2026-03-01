import { Router } from 'express'
import cursosRouter from './cursos'
import estudiantesRouter from './estudiantes'
import solicitudesRouter from './solicitudes'

const router = Router()

router.use('/cursos', cursosRouter)
router.use('/estudiantes', estudiantesRouter)
router.use('/solicitudes', solicitudesRouter)

export default router
