import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { clearTestDb, loginAsTestAdmin, setupTestDb, teardownTestDb, TEST_ADMIN } from './helpers.js'

const app = createApp()

describe('Admin authentication', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  beforeEach(async () => {
    await clearTestDb()
    await loginAsTestAdmin(app)
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('accepts valid credentials and returns a token and safe user object', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_ADMIN.email, password: TEST_ADMIN.password })

    expect(res.status).toBe(200)
    expect(typeof res.body.data.token).toBe('string')
    expect(res.body.data.user).toMatchObject({ email: TEST_ADMIN.email, name: TEST_ADMIN.name })
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash|\$2[aby]\$/)
  })

  it('rejects a wrong password with a generic credentials error', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: TEST_ADMIN.email, password: 'wrong-password' })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      success: false,
      error: { message: 'Invalid email or password.', code: 'INVALID_CREDENTIALS' },
    })
  })

  it('rejects an unknown email with the same generic error', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@example.test', password: 'whatever-123456' })

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('rejects a malformed login body with a validation error', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'not-an-email' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 401 from /me without a token, using the standard error envelope', async () => {
    const res = await request(app).get('/api/auth/me')

    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({ success: false, error: { code: 'UNAUTHORIZED' } })
  })

  it('returns 401 for a malformed or forged token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer not.a.real.token')

    expect(res.status).toBe(401)
  })

  it('returns the current user from /me with a valid token', async () => {
    const token = await loginAsTestAdmin(app)
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe(TEST_ADMIN.email)
    expect(res.body.data.passwordHash).toBeUndefined()
  })

  it('invalidates the session server-side on logout, not just client-side', async () => {
    const token = await loginAsTestAdmin(app)
    const logout = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${token}`)
    expect(logout.status).toBe(200)

    const after = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)
    expect(after.status).toBe(401)
  })
})
