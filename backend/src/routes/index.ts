import { Router } from 'express'
import cursosRouter from './cursos'
import estudiantesRouter from './estudiantes'
import solicitudesRouter from './solicitudes'
import authRouter from './auth'
import areasRouter from './areas'
const router = Router()

router.use('/auth', authRouter)
router.use('/cursos', cursosRouter)
router.use('/estudiantes', estudiantesRouter)
router.use('/solicitudes', solicitudesRouter)
router.use('/areas', areasRouter)

export default router
