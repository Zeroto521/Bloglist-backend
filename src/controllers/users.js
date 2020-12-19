import bcrypt from 'bcrypt'
import express from 'express'

import { User } from '../models/user.js'

const usersRouter = express.Router()

usersRouter.get('/', async (_, response) => {
  const users = await User.find({}).populate('notes')
  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  if (body.username.length <= 3) {
    return response.status(400).send({ error: 'username length less than 3' })
  }
  if (body.password.length <= 3) {
    return response.status(400).send({ error: 'password length less than 3' })
  }

  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

export { usersRouter }