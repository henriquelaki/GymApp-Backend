import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Search Gyms (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search for Gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Gym 1',
        description: 'A new gym',
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Gym 2',
        description: 'A new gym 2',
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'New Gym 1',
        page: 1,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toBe(200)

    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'New Gym 1',
        }),
      ]),
    )
  })
})
