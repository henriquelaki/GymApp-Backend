import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

const validCoordinates = {
  latitude: -23.6814347,
  longitude: -46.9249399,
}

describe('Create Check-in (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to check into a Gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'New Gym',
        description: 'A new gym',
        phone: '123456789',
        ...validCoordinates,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-in`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...validCoordinates,
      })
    expect(response.status).toBe(201)
  })
})
