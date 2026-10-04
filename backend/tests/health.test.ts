import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { setupTestDb, teardownTestDb } from './helpers.js'

describe('GET /api/health', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('reports ok when the database is connected', async () => {
    const { createApp } = await import('../src/app.js')
    const app = createApp()

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      success: true,
      data: { status: 'ok', database: 'connected', environment: 'test' },
    })
  })
})

describe('GET /api/health when the database is unavailable', () => {
  // Deliberately does NOT connect — verifies the app fails clearly (503,
  // not a crash or a silent "everything's fine") per section 41.
  it('reports degraded/503 without crashing', async () => {
    const { createApp } = await import('../src/app.js')
    const app = createApp()

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(503)
    expect(res.body).toMatchObject({
      success: false,
      data: { status: 'degraded', database: 'disconnected' },
    })
  })
})
