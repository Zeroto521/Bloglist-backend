import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import { Blog } from './model.js'
import { unknownEndpoint, errorHandler } from './utils/middleware.js'
import config from './config.js'
import logger from './utils/logger.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('build'))

app.get('/api/blogs', (_, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const body = request.body

  if (body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }
  if (body.author === undefined) {
    return response.status(400).json({ error: 'author missing' })
  }
  if (body.url === undefined) {
    return response.status(400).json({ error: 'url missing' })
  }
  if (body.likes === undefined) {
    return response.status(400).json({ error: 'likes missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save().then(result => {
    response.status(201).json(result)
  })
})


app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = config.PORT || 3001
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
