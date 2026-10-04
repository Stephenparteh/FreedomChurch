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
