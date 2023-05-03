import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Profile (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token, name, email } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: expect.any(String),
          name,
          email,
          created_at: expect.any(String),
        }),
      }),
    )
  })

  it('should not be able to get user profile without valid token', async () => {
    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer wrong-token`)
    expect(response.status).toBe(401)
  })
})
