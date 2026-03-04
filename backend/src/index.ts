import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import apiRouter from './routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// mount versioned API routes
app.use('/api', apiRouter)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})
