import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

const validCoordinates = {
  latitude: -23.6814347,
  longitude: -46.9249399,
}

describe('Validate check-in (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    const user = await prisma.user.findFirstOrThrow()
    const gym = await prisma.gym.create({
      data: {
        title: 'New Gym',
        description: 'A new gym',
        phone: '123456789',
        ...validCoordinates,
      },
    })

    let checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id,
      },
    })

    expect(checkIn.validated_at).toBeNull()

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.status).toBe(204)

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
