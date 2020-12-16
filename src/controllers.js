import express from 'express'

import { Blog } from './model.js'

const appRouter = express.Router()

appRouter.get('/', (_, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

appRouter.post('/', (request, response) => {
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


export { appRouter }
