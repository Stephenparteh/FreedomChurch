import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()

const adminRoutes: Array<[method: 'get' | 'post' | 'patch' | 'delete', path: string]> = [
  ['get', '/api/admin/sermons'],
  ['post', '/api/admin/sermons'],
  ['patch', '/api/admin/sermons/507f1f77bcf86cd799439011'],
  ['delete', '/api/admin/sermons/507f1f77bcf86cd799439011'],
  ['get', '/api/admin/events'],
  ['post', '/api/admin/events'],
  ['get', '/api/admin/gallery'],
  ['post', '/api/admin/gallery'],
  ['get', '/api/admin/ministries'],
  ['post', '/api/admin/ministries'],
  ['get', '/api/admin/service-sessions'],
  ['post', '/api/admin/service-sessions'],
  ['get', '/api/admin/announcements'],
  ['post', '/api/admin/announcements'],
  ['get', '/api/admin/leadership'],
  ['post', '/api/admin/leadership'],
  ['get', '/api/admin/messages'],
  ['get', '/api/admin/messages/507f1f77bcf86cd799439011'],
  ['patch', '/api/admin/messages/507f1f77bcf86cd799439011'],
  ['delete', '/api/admin/messages/507f1f77bcf86cd799439011'],
  ['get', '/api/admin/settings'],
  ['patch', '/api/admin/settings'],
  ['post', '/api/admin/uploads'],
]

describe('Admin API requires authentication at the API layer', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it.each(adminRoutes)('%s %s rejects unauthenticated requests with 401', async (method, path) => {
    const res = await request(app)[method](path).send({ title: 'x' })

    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({ success: false, error: { code: 'UNAUTHORIZED' } })
  })

  it('rejects a Bearer token that is not a real session', async () => {
    const res = await request(app)
      .post('/api/admin/sermons')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4In0.invalid')
      .send({})

    expect(res.status).toBe(401)
  })

  it('keeps public read endpoints open without authentication', async () => {
    for (const path of ['/api/sermons', '/api/events', '/api/ministries', '/api/site-settings', '/api/service-sessions']) {
      const res = await request(app).get(path)
      expect(res.status).toBe(200)
    }
  })

  it('never exposes contact submissions through a public endpoint', async () => {
    const res = await request(app).get('/api/messages')
    expect(res.status).toBe(404)
  })
})
