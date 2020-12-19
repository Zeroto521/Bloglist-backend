import logger from './logger.js'

const unknownEndpoint = (_, response) => {
  response.status(404).send({
    'error': 'unknown endpoint'
  })
}

const errorHandler = (error, _, response, next) => {
  logger.info(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ "error": 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ "error": error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ "error": 'invalid token' })
  }

  next(error)
}

export { unknownEndpoint, errorHandler }
