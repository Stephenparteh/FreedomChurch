import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { GalleryItemModel } from '../src/models/GalleryItem.js'
import { clearTestDb, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()

describe('Gallery API', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterEach(async () => {
    await clearTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('returns an empty-state-friendly response with no gallery items', async () => {
    const res = await request(app).get('/api/gallery')
    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
  })

  it('filters by category', async () => {
    await GalleryItemModel.create([
      { imageUrl: '/a.webp', altText: 'a', category: 'Worship', isPublished: true },
      { imageUrl: '/b.webp', altText: 'b', category: 'Youth', isPublished: true },
    ])

    const res = await request(app).get('/api/gallery?category=Worship')
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].altText).toBe('a')
  })
})
