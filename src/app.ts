import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'

import fastifyJwt from '@fastify/jwt'
import cookie from '@fastify/cookie'

import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'

export const app = fastify()
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(cookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError)
    return reply
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })

  if (env.NODE_ENV !== 'production') console.error(error)
  else {
    // TODO: Send error to External Service
  }

  return reply.status(500).send({ message: error.message })
})
