import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { MinistryModel } from '../src/models/Ministry.js'
import { clearTestDb, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()

describe('Ministries API', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterEach(async () => {
    await clearTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('returns published ministries sorted by displayOrder, unpaginated', async () => {
    await MinistryModel.create([
      {
        name: 'Outreach',
        slug: 'outreach',
        shortDescription: 'x',
        description: 'x',
        displayOrder: 2,
        isPublished: true,
      },
      {
        name: 'Worship',
        slug: 'worship',
        shortDescription: 'x',
        description: 'x',
        displayOrder: 1,
        isPublished: true,
      },
      {
        name: 'Draft',
        slug: 'draft',
        shortDescription: 'x',
        description: 'x',
        displayOrder: 0,
        isPublished: false,
      },
    ])

    const res = await request(app).get('/api/ministries')

    expect(res.body.pagination).toBeUndefined()
    expect(res.body.data.map((m: { slug: string }) => m.slug)).toEqual(['worship', 'outreach'])
  })

  it('gets a single ministry by slug', async () => {
    await MinistryModel.create({
      name: 'Worship',
      slug: 'worship',
      shortDescription: 'x',
      description: 'x',
      isPublished: true,
    })

    const res = await request(app).get('/api/ministries/worship')
    expect(res.status).toBe(200)
    expect(res.body.data.name).toBe('Worship')
  })
})
