import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { setupTestDb, teardownTestDb } from './helpers.js'

describe('Login rate limit', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('allows 10 login attempts per window, then refuses with 429', async () => {
    const app = createApp()
    const attempt = () => request(app).post('/api/auth/login').send({ email: 'nobody@example.test', password: 'wrong-password' })

    for (let i = 0; i < 10; i++) {
      expect((await attempt()).status).toBe(401)
    }
    const blocked = await attempt()
    expect(blocked.status).toBe(429)
    expect(blocked.body.error.code).toBe('RATE_LIMITED')
  })
})
