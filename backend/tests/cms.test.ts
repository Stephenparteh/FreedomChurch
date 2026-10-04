import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { clearTestDb, loginAsTestAdmin, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()
let token = ''
const auth = () => ({ Authorization: `Bearer ${token}` })

const futureIso = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

describe('CMS resources (admin CRUD and public visibility)', () => {
  beforeAll(async () => {
    await setupTestDb()
  })
  beforeEach(async () => {
    await clearTestDb()
    token = await loginAsTestAdmin(app)
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  describe('sermons', () => {
    const sermon = (over: Record<string, unknown> = {}) => ({
      title: 'Walking in Faith',
      description: 'A teaching on faith.',
      speaker: 'Test Speaker',
      date: '2026-01-04T00:00:00.000Z',
      ...over,
    })

    it('creates a draft that is hidden from the public API until published', async () => {
      const created = await request(app).post('/api/admin/sermons').set(auth()).send(sermon())
      expect(created.status).toBe(201)
      expect(created.body.data.slug).toBe('walking-in-faith')
      expect(created.body.data.isPublished).toBe(false)

      const publicBefore = await request(app).get('/api/sermons')
      expect(publicBefore.body.data).toHaveLength(0)

      const published = await request(app)
        .patch(`/api/admin/sermons/${created.body.data.id}`)
        .set(auth())
        .send({ isPublished: true })
      expect(published.status).toBe(200)

      const publicAfter = await request(app).get('/api/sermons')
      expect(publicAfter.body.data.map((s: { slug: string }) => s.slug)).toEqual(['walking-in-faith'])
    })

    it('updates, unpublishes, and deletes', async () => {
      const created = await request(app).post('/api/admin/sermons').set(auth()).send(sermon({ isPublished: true }))
      const id = created.body.data.id

      const edited = await request(app).patch(`/api/admin/sermons/${id}`).set(auth()).send({ speaker: 'New Speaker' })
      expect(edited.body.data.speaker).toBe('New Speaker')

      const unpublished = await request(app).patch(`/api/admin/sermons/${id}`).set(auth()).send({ isPublished: false })
      expect(unpublished.body.data.isPublished).toBe(false)
      expect((await request(app).get(`/api/sermons/walking-in-faith`)).status).toBe(404)

      const deleted = await request(app).delete(`/api/admin/sermons/${id}`).set(auth())
      expect(deleted.status).toBe(200)
      expect((await request(app).get(`/api/admin/sermons/${id}`).set(auth())).status).toBe(404)
    })

    it('rejects a missing required field with a field-level message', async () => {
      const res = await request(app).post('/api/admin/sermons').set(auth()).send({ title: '' })
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })

    it('rejects a media reference that is not an allowed path or URL', async () => {
      const res = await request(app)
        .post('/api/admin/sermons')
        .set(auth())
        .send(sermon({ thumbnail: '/etc/passwd' }))
      expect(res.status).toBe(400)
    })

    it('rejects a duplicate slug with a 409', async () => {
      await request(app).post('/api/admin/sermons').set(auth()).send(sermon())
      const dup = await request(app).post('/api/admin/sermons').set(auth()).send(sermon())
      expect(dup.status).toBe(409)
      expect(dup.body.error.code).toBe('DUPLICATE_KEY')
    })
  })

  describe('events', () => {
    const event = (over: Record<string, unknown> = {}) => ({
      title: 'Youth Night',
      description: 'An evening for young people.',
      date: futureIso,
      startTime: '18:00',
      endTime: '20:00',
      category: 'Youth Events',
      location: 'Fellowship Hall',
      rsvpUrl: 'https://example.org/rsvp',
      isPublished: true,
      ...over,
    })

    it('stores start/end times and category, and exposes them publicly', async () => {
      await request(app).post('/api/admin/events').set(auth()).send(event())
      const res = await request(app).get('/api/events/youth-night')
      expect(res.status).toBe(200)
      expect(res.body.data).toMatchObject({ startTime: '18:00', endTime: '20:00', category: 'Youth Events' })
    })

    it('rejects a time that is not HH:MM', async () => {
      const res = await request(app).post('/api/admin/events').set(auth()).send(event({ startTime: '6pm' }))
      expect(res.status).toBe(400)
    })

    it('rejects a category outside the dropdown list', async () => {
      const res = await request(app).post('/api/admin/events').set(auth()).send(event({ category: 'Random' }))
      expect(res.status).toBe(400)
    })

    it('edits an existing valid RSVP URL', async () => {
      const created = await request(app).post('/api/admin/events').set(auth()).send(event())
      const res = await request(app)
        .patch(`/api/admin/events/${created.body.data.id}`)
        .set(auth())
        .send({ rsvpUrl: 'https://example.org/rsvp-updated' })
      expect(res.status).toBe(200)
      expect(res.body.data.rsvpUrl).toBe('https://example.org/rsvp-updated')
    })

    it('clears the RSVP URL when an empty string is submitted', async () => {
      const created = await request(app).post('/api/admin/events').set(auth()).send(event())
      const res = await request(app).patch(`/api/admin/events/${created.body.data.id}`).set(auth()).send({ rsvpUrl: '' })
      expect(res.status).toBe(200)
      expect(res.body.data.rsvpUrl).toBeUndefined()
    })

    it('rejects a non-URL RSVP value on update', async () => {
      const created = await request(app).post('/api/admin/events').set(auth()).send(event())
      const res = await request(app)
        .patch(`/api/admin/events/${created.body.data.id}`)
        .set(auth())
        .send({ rsvpUrl: 'javascript:alert(1)' })
      expect(res.status).toBe(400)
    })

    it('hides unpublished events from the public list', async () => {
      await request(app).post('/api/admin/events').set(auth()).send(event({ title: 'Secret Draft', isPublished: false }))
      const res = await request(app).get('/api/events')
      expect(res.body.data).toHaveLength(0)
    })
  })

  describe('gallery', () => {
    it('requires an image and alt text, and accepts an uploaded-style path', async () => {
      const missing = await request(app).post('/api/admin/gallery').set(auth()).send({ altText: 'x' })
      expect(missing.status).toBe(400)

      const ok = await request(app)
        .post('/api/admin/gallery')
        .set(auth())
        .send({ imageUrl: '/uploads/abc-123.jpg', altText: 'Worship service', category: 'Sunday Worship', isPublished: true })
      expect(ok.status).toBe(201)
      const list = await request(app).get('/api/gallery')
      expect(list.body.data[0].imageUrl).toBe('/uploads/abc-123.jpg')
    })
  })

  describe('ministries', () => {
    it('generates a slug from the name and supports ordering and hiding', async () => {
      const created = await request(app)
        .post('/api/admin/ministries')
        .set(auth())
        .send({
          name: 'Youth Ministry',
          shortDescription: 'Short line.',
          description: 'Description.',
          displayOrder: 3,
          isPublished: false,
        })
      expect(created.body.data.slug).toBe('youth-ministry')
      expect((await request(app).get('/api/ministries')).body.data).toHaveLength(0)

      await request(app).patch(`/api/admin/ministries/${created.body.data.id}`).set(auth()).send({ isPublished: true })
      expect((await request(app).get('/api/ministries')).body.data).toHaveLength(1)
    })
  })

  describe('service / Bible study sessions', () => {
    const session = (over: Record<string, unknown> = {}) => ({
      name: 'Tuesday Bible Study',
      dayOfWeek: 'Tuesday',
      startTime: '18:30',
      platform: 'online',
      meetingUrl: 'https://meet.example.org/abc',
      isPublished: true,
      ...over,
    })

    it('supports any number of independent sessions without code changes', async () => {
      await request(app).post('/api/admin/service-sessions').set(auth()).send(session())
      await request(app).post('/api/admin/service-sessions').set(auth()).send(session({ name: 'Thursday Bible Study', dayOfWeek: 'Thursday' }))
      await request(app).post('/api/admin/service-sessions').set(auth()).send(session({ name: 'Saturday Debate', dayOfWeek: 'Saturday', platform: 'in-person', meetingUrl: '' }))

      const res = await request(app).get('/api/service-sessions')
      expect(res.body.data.map((s: { name: string }) => s.name).sort()).toEqual([
        'Saturday Debate',
        'Thursday Bible Study',
        'Tuesday Bible Study',
      ])
    })

    it('rejects an unknown weekday and an invalid meeting URL', async () => {
      expect((await request(app).post('/api/admin/service-sessions').set(auth()).send(session({ dayOfWeek: 'Funday' }))).status).toBe(400)
      expect((await request(app).post('/api/admin/service-sessions').set(auth()).send(session({ meetingUrl: 'not a url' }))).status).toBe(400)
    })

    it('hides unpublished sessions from the public list', async () => {
      await request(app).post('/api/admin/service-sessions').set(auth()).send(session({ isPublished: false }))
      expect((await request(app).get('/api/service-sessions')).body.data).toHaveLength(0)
    })
  })

  describe('announcements', () => {
    it('hides archived announcements from the public list but keeps them in admin', async () => {
      const created = await request(app)
        .post('/api/admin/announcements')
        .set(auth())
        .send({ title: 'Old News', content: 'Archived content here.', isPublished: true })
      expect(created.status).toBe(201)
      expect((await request(app).get('/api/announcements')).body.data).toHaveLength(1)

      await request(app).patch(`/api/admin/announcements/${created.body.data.id}`).set(auth()).send({ isArchived: true })
      expect((await request(app).get('/api/announcements')).body.data).toHaveLength(0)
      expect((await request(app).get('/api/admin/announcements').set(auth())).body.data).toHaveLength(1)
    })
  })

  describe('team / leadership', () => {
    it('stores social links, and clears one when submitted empty', async () => {
      const created = await request(app)
        .post('/api/admin/leadership')
        .set(auth())
        .send({
          name: 'Test Leader',
          role: 'Test Role',
          socialLinks: { facebook: 'https://facebook.com/test', instagram: '' },
          isPublished: true,
        })
      expect(created.status).toBe(201)

      const cleared = await request(app)
        .patch(`/api/admin/leadership/${created.body.data.id}`)
        .set(auth())
        .send({ socialLinks: { facebook: '' } })
      expect(cleared.status).toBe(200)
      expect(cleared.body.data.socialLinks?.facebook).toBeUndefined()
    })

    it('does not invent a leadership record', async () => {
      expect((await request(app).get('/api/leadership')).body.data).toEqual([])
    })
  })
})
