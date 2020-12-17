import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

import { blogsRouter } from './controllers.js'
import { unknownEndpoint, errorHandler } from './utils/middleware.js'

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

app.use('/api/blogs', blogsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export { app }
