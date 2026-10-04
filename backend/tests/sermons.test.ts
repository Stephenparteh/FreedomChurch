import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { SermonModel } from '../src/models/Sermon.js'
import { clearTestDb, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()

describe('Sermons API', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterEach(async () => {
    await clearTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('returns an empty list with pagination metadata when there are no sermons', async () => {
    const res = await request(app).get('/api/sermons')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toEqual([])
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 12, total: 0, totalPages: 1 })
  })

  it('only returns published sermons', async () => {
    await SermonModel.create([
      {
        title: 'Published',
        slug: 'published',
        description: 'x',
        speaker: 'y',
        date: new Date(),
        isPublished: true,
      },
      {
        title: 'Draft',
        slug: 'draft',
        description: 'x',
        speaker: 'y',
        date: new Date(),
        isPublished: false,
      },
    ])

    const res = await request(app).get('/api/sermons')

    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].slug).toBe('published')
    // isPublished is internal — should not leak into the public API shape.
    expect(res.body.data[0].isPublished).toBeUndefined()
    expect(res.body.data[0].id).toBeDefined()
    expect(res.body.data[0]._id).toBeUndefined()
  })

  it('filters by category', async () => {
    await SermonModel.create([
      { title: 'A', slug: 'a', description: 'x', speaker: 'y', date: new Date(), category: 'Faith', isPublished: true },
      { title: 'B', slug: 'b', description: 'x', speaker: 'y', date: new Date(), category: 'Hope', isPublished: true },
    ])

    const res = await request(app).get('/api/sermons?category=Faith')

    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].slug).toBe('a')
  })

  it('paginates results', async () => {
    await SermonModel.create(
      Array.from({ length: 5 }, (_, i) => ({
        title: `Sermon ${i}`,
        slug: `sermon-${i}`,
        description: 'x',
        speaker: 'y',
        date: new Date(),
        isPublished: true,
      })),
    )

    const res = await request(app).get('/api/sermons?page=2&limit=2')

    expect(res.body.data).toHaveLength(2)
    expect(res.body.pagination).toMatchObject({ page: 2, limit: 2, total: 5, totalPages: 3 })
  })

  it('gets a single sermon by slug', async () => {
    await SermonModel.create({
      title: 'Solo',
      slug: 'solo',
      description: 'x',
      speaker: 'y',
      date: new Date(),
      isPublished: true,
    })

    const res = await request(app).get('/api/sermons/solo')

    expect(res.status).toBe(200)
    expect(res.body.data.title).toBe('Solo')
  })

  it('returns 404 for an unknown slug', async () => {
    const res = await request(app).get('/api/sermons/does-not-exist')

    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({ success: false, error: { code: 'NOT_FOUND' } })
  })

  it('returns 404 for an unpublished sermon looked up by slug', async () => {
    await SermonModel.create({
      title: 'Hidden',
      slug: 'hidden',
      description: 'x',
      speaker: 'y',
      date: new Date(),
      isPublished: false,
    })

    const res = await request(app).get('/api/sermons/hidden')

    expect(res.status).toBe(404)
  })
})
