import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { clearTestDb, loginAsTestAdmin, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()
let token = ''
const auth = () => ({ Authorization: `Bearer ${token}` })


describe('Contact messages inbox', () => {
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

  async function submit() {
    const res = await request(app).post('/api/contact').send({
      name: 'Visitor Name',
      email: 'visitor@example.com',
      subject: 'Visiting',
      message: 'I would like to visit on Sunday.',
    })
    return res.body.data.id as string
  }

  it('lists submissions with sender, email, subject, message, and status', async () => {
    await submit()
    const res = await request(app).get('/api/admin/messages').set(auth())
    expect(res.status).toBe(200)
    expect(res.body.data[0]).toMatchObject({
      name: 'Visitor Name',
      email: 'visitor@example.com',
      subject: 'Visiting',
      status: 'new',
    })
    expect(res.body.data[0].createdAt).toBeDefined()
  })

  it('marks read and unread, and filters by status', async () => {
    const id = await submit()
    const read = await request(app).patch(`/api/admin/messages/${id}`).set(auth()).send({ status: 'read' })
    expect(read.body.data.status).toBe('read')

    expect((await request(app).get('/api/admin/messages?status=new').set(auth())).body.data).toHaveLength(0)
    expect((await request(app).get('/api/admin/messages?status=read').set(auth())).body.data).toHaveLength(1)

    const unread = await request(app).patch(`/api/admin/messages/${id}`).set(auth()).send({ status: 'new' })
    expect(unread.body.data.status).toBe('new')
  })

  it('deletes a message', async () => {
    const id = await submit()
    expect((await request(app).delete(`/api/admin/messages/${id}`).set(auth())).status).toBe(200)
    expect((await request(app).get(`/api/admin/messages/${id}`).set(auth())).status).toBe(404)
  })

  it('never returns submissions on any public endpoint', async () => {
    await submit()
    for (const path of ['/api/contact', '/api/sermons', '/api/site-settings']) {
      const res = await request(app).get(path)
      expect(JSON.stringify(res.body)).not.toContain('visitor@example.com')
    }
  })
})

describe('Site settings protection and public reflection', () => {
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

  it('rejects unauthenticated updates', async () => {
    const res = await request(app).patch('/api/admin/settings').send({ churchName: 'Hacked Name' })
    expect(res.status).toBe(401)
  })

  it('applies an authenticated update and reflects it on the public endpoint', async () => {
    const res = await request(app)
      .patch('/api/admin/settings')
      .set(auth())
      .send({ address: '1 Test Street', email: 'info@example.test', footerNote: 'Test footer.' })
    expect(res.status).toBe(200)

    const pub = await request(app).get('/api/site-settings')
    expect(pub.body.data).toMatchObject({
      address: '1 Test Street',
      email: 'info@example.test',
      footerNote: 'Test footer.',
    })
  })

  it('keeps description and aboutDescription independent', async () => {
    await request(app)
      .patch('/api/admin/settings')
      .set(auth())
      .send({ description: 'Hero text.', aboutDescription: 'About section text.' })

    const pub = await request(app).get('/api/site-settings')
    expect(pub.body.data.description).toBe('Hero text.')
    expect(pub.body.data.aboutDescription).toBe('About section text.')

    await request(app).patch('/api/admin/settings').set(auth()).send({ aboutDescription: 'Updated About text.' })
    const after = await request(app).get('/api/site-settings')
    expect(after.body.data.description).toBe('Hero text.')
    expect(after.body.data.aboutDescription).toBe('Updated About text.')
  })

  it('keeps unverified values unset rather than inventing them', async () => {
    const pub = await request(app).get('/api/site-settings')
    expect(pub.body.data.churchName).toBe('National Freedom Pentecostal Church')
    expect(pub.body.data.motto).toBe('You Must Be Free')
    expect(pub.body.data.email).toBeUndefined()
    expect(pub.body.data.phone).toBeUndefined()
    expect(pub.body.data.address).toBeUndefined()
  })

  it('clears a field when an empty string is submitted', async () => {
    await request(app).patch('/api/admin/settings').set(auth()).send({ phone: '555-0100' })
    await request(app).patch('/api/admin/settings').set(auth()).send({ phone: '' })
    const pub = await request(app).get('/api/site-settings')
    expect(pub.body.data.phone).toBeUndefined()
  })

  it('rejects an invalid email address', async () => {
    const res = await request(app).patch('/api/admin/settings').set(auth()).send({ email: 'not-an-email' })
    expect(res.status).toBe(400)
  })
})
