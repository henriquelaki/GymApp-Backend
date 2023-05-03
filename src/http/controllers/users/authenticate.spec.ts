import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate a session', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@mail.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'john.doe@mail.com',
      password: '123456',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
