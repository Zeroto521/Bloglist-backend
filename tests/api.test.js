import mongoose from 'mongoose'
import supertest from 'supertest'

import { app } from '../src/app.js'
import { Blog } from '../src/model.js'
import helper from './test_helper.js'

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
})

test('length of the blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12, __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', 'application/json; charset=utf-8')

  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(contents).toContain('Canonical string reduction')
})

test('a blog missed likes attribute can be the default value', async () => {
  const newBlog = {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    __v: 0
  }

  const response = await api.post('/api/blogs').send(newBlog)
  expect(response.body.likes).toBe(0)
})


test('a invalid blog missed title and url can be returned 400 status', async () => {
  const newBlog = {
    _id: "5a422b3a1b54a676234d17f9",
    author: "Edsger W. Dijkstra",
    likes: 0,
    __v: 0
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})


afterAll(() => {
  mongoose.connection.close()
})
