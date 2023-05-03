import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Create Gyms (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new gym', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Gym',
        description: 'A new gym',
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      })
    expect(response.status).toBe(201)
  })

  it('should not be able to create a new gym without admin privileges', async () => {
    const { token } = await createAndAuthenticateUser(app, 'MEMBER')

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Gym',
        description: 'A new gym',
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      })
    expect(response.status).toBe(401)
  })
})
