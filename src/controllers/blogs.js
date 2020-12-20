import 'express-async-errors'
import express from 'express'
import jwt from 'jsonwebtoken'

import { Blog } from '../models/blog.js'
import { User } from '../models/user.js'

const blogsRouter = express.Router()

blogsRouter.get('/', async (_, response) => {
  const blogs = await Blog.find({}).populate(
    'user', { 'username': 1, 'name': 1 }
  )
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    "title": body.title,
    "author": body.author,
    "url": body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})


blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)

  if (user.blogs.includes(request.params.id)) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }

  response.status(403).end()
})

export { blogsRouter }
