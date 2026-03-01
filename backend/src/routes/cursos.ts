import { Router } from 'express'
import { getCursos, createCurso, updateCurso } from '../controllers/cursosController'

const router = Router()

router.get('/', getCursos)
router.post('/', createCurso)
router.put('/:id', updateCurso)

export default router
