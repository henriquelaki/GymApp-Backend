import { Role } from '@/@types/roles'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  userRole: Role = 'MEMBER',
) {
  const emailPrefix = randomUUID()
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: `${emailPrefix}@mail.com`,
      password_hash: await hash('123456', 6),
      role: userRole,
    },
  })

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: `${emailPrefix}@mail.com`,
      password: '123456',
    })

  const { token } = authResponse.body

  return { token, name: 'John Doe', email: `${emailPrefix}@mail.com` }
}
