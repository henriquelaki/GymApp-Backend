import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

const nearbyCoordinates = {
  latitude: -23.6814347,
  longitude: -46.9249399,
}

const farAwayCoordinates = {
  latitude: -23.5444064,
  longitude: -46.7283586,
}

describe('Search Nearby Gyms (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search for nearby Gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Nearby Gym 1',
        description: 'A new gym nearby user',
        phone: '123456789',
        ...nearbyCoordinates,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Nearby Gym 2',
        description: 'A new gym nearby user',
        phone: '123456789',
        ...nearbyCoordinates,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far away Gym',
        description: 'A new gym nearby user',
        phone: '123456789',
        ...farAwayCoordinates,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        ...nearbyCoordinates,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)

    expect(response.body.gyms).toHaveLength(2)
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Nearby Gym 1',
        }),
        expect.objectContaining({
          title: 'Nearby Gym 2',
        }),
      ]),
    )
  })
})
