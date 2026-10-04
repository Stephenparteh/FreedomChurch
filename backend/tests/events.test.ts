import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { EventModel } from '../src/models/Event.js'
import { clearTestDb, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()

describe('Events API', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterEach(async () => {
    await clearTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('filters to only upcoming events when upcoming=true', async () => {
    const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await EventModel.create([
      { title: 'Past', slug: 'past', description: 'x', date: past, isPublished: true },
      { title: 'Future', slug: 'future', description: 'x', date: future, isPublished: true },
    ])

    const res = await request(app).get('/api/events?upcoming=true')

    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].slug).toBe('future')
  })

  it('returns all published events when upcoming is not set', async () => {
    const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await EventModel.create([
      { title: 'Past', slug: 'past', description: 'x', date: past, isPublished: true },
      { title: 'Future', slug: 'future', description: 'x', date: future, isPublished: true },
    ])

    const res = await request(app).get('/api/events')

    expect(res.body.data).toHaveLength(2)
  })
})
