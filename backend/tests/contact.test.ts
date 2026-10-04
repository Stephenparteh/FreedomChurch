import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { ContactSubmissionModel } from '../src/models/ContactSubmission.js'
import { clearTestDb, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()

describe('POST /api/contact', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterEach(async () => {
    await clearTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('accepts a valid submission and persists it', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello, I would like more information about the church.',
    })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({ success: true, data: { received: true } })

    const stored = await ContactSubmissionModel.findById(res.body.data.id)
    expect(stored?.email).toBe('jane@example.com')
    expect(stored?.status).toBe('new')
  })

  it('rejects a submission missing required fields', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'Jane' })

    expect(res.status).toBe(400)
    expect(res.body).toMatchObject({ success: false, error: { code: 'VALIDATION_ERROR' } })
  })

  it('rejects an invalid email address', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Jane Doe',
      email: 'not-an-email',
      message: 'Hello, I would like more information about the church.',
    })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('rejects a message that is too short', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'hi',
    })

    expect(res.status).toBe(400)
  })
})
