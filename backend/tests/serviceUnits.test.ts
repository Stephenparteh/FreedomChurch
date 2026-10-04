import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { MinistryModel } from '../src/models/Ministry.js'
import { ServiceUnitModel } from '../src/models/ServiceUnit.js'
import { clearTestDb, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()

describe('Service units API', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterEach(async () => {
    await clearTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('returns an empty list for an unknown ministry slug, not unlinked units', async () => {
    const worship = await MinistryModel.create({
      name: 'Worship',
      slug: 'worship',
      shortDescription: 'x',
      description: 'x',
      isPublished: true,
    })
    await ServiceUnitModel.create([
      { name: 'Linked', slug: 'linked', description: 'x', ministry: worship._id, isPublished: true },
      { name: 'Unlinked', slug: 'unlinked', description: 'x', isPublished: true },
    ])

    const res = await request(app).get('/api/service-units?ministry=does-not-exist')

    expect(res.status).toBe(200)
    expect(res.body.data).toEqual([])
  })

  it('filters to units of a known published ministry', async () => {
    const worship = await MinistryModel.create({
      name: 'Worship',
      slug: 'worship',
      shortDescription: 'x',
      description: 'x',
      isPublished: true,
    })
    await ServiceUnitModel.create([
      { name: 'Linked', slug: 'linked', description: 'x', ministry: worship._id, isPublished: true },
      { name: 'Unlinked', slug: 'unlinked', description: 'x', isPublished: true },
    ])

    const res = await request(app).get('/api/service-units?ministry=worship')

    expect(res.body.data.map((u: { slug: string }) => u.slug)).toEqual(['linked'])
  })
})
