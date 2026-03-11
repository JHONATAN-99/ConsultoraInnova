import { Router } from 'express'
import cursosRouter from './cursos'
import estudiantesRouter from './estudiantes'
import authRouter from './auth'
import areasRouter from './areas'
import inscripcionesRouter from './inscripciones'
import pagosRouter from './pagos'

const router = Router()

router.use('/auth', authRouter)
router.use('/cursos', cursosRouter)
router.use('/estudiantes', estudiantesRouter)
router.use('/areas', areasRouter)
router.use('/inscripciones', inscripcionesRouter)
router.use('/pagos', pagosRouter)

export default router
