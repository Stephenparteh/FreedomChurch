import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { clearTestDb, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()

describe('GET /api/site-settings', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterEach(async () => {
    await clearTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('auto-creates the singleton with only verified defaults on first request', async () => {
    const res = await request(app).get('/api/site-settings')

    expect(res.status).toBe(200)
    expect(res.body.data.churchName).toBe('National Freedom Pentecostal Church')
    expect(res.body.data.motto).toBe('You Must Be Free')
    // Unconfirmed facts stay unset — never defaulted to something invented.
    expect(res.body.data.email).toBeUndefined()
    expect(res.body.data.phone).toBeUndefined()
    expect(res.body.data.address).toBeUndefined()
    expect(res.body.data.serviceTimes).toEqual([])
  })

  it('returns the same singleton on repeated requests, not a duplicate', async () => {
    const first = await request(app).get('/api/site-settings')
    const second = await request(app).get('/api/site-settings')

    expect(first.body.data.id).toBe(second.body.data.id)
  })
})
