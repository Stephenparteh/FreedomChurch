import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()

describe('Unknown routes', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('returns a consistent 404 JSON error for an unknown resource', async () => {
    const res = await request(app).get('/api/this-does-not-exist')

    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 'ROUTE_NOT_FOUND' },
    })
  })
})

describe('Client body errors', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('answers malformed JSON with 400, not a server error', async () => {
    const { createApp } = await import('../src/app.js')
    const res = await request(createApp())
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .send('{"name": ')
    expect(res.status).toBe(400)
    expect(res.body).toMatchObject({ success: false, error: { code: 'INVALID_JSON' } })
  })

  it('answers an oversized body with 413', async () => {
    const { createApp } = await import('../src/app.js')
    const res = await request(createApp())
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ message: 'x'.repeat(200 * 1024) }))
    expect(res.status).toBe(413)
    expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE')
  })
})
