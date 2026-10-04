import { mkdirSync, readdirSync, existsSync } from 'node:fs'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { UPLOAD_DIR } from '../src/utils/upload.js'
import { clearTestDb, loginAsTestAdmin, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()
let token = ''
const auth = () => ({ Authorization: `Bearer ${token}` })

// A tiny valid PNG (signature + padding), used as a real image fixture.
const PNG = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.alloc(64, 0),
])

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

describe('Media uploads', () => {
  beforeAll(async () => {
    await setupTestDb()
    mkdirSync(UPLOAD_DIR, { recursive: true })
  })
  beforeEach(async () => {
    await clearTestDb()
    token = await loginAsTestAdmin(app)
  })
  afterAll(async () => {
    await teardownTestDb()
  })

  it('rejects unauthenticated uploads', async () => {
    const res = await request(app).post('/api/admin/uploads').attach('file', PNG, { filename: 'a.png', contentType: 'image/png' })
    expect(res.status).toBe(401)
  })

  it('accepts a real PNG, returns a usable /uploads URL, and serves the file', async () => {
    const res = await request(app)
      .post('/api/admin/uploads')
      .set(auth())
      .attach('file', PNG, { filename: 'photo.png', contentType: 'image/png' })

    expect(res.status).toBe(201)
    expect(res.body.data.url).toMatch(/^\/uploads\/[0-9a-f-]+\.png$/)
    expect(res.body.data.url).not.toContain('photo')

    const served = await request(app).get(res.body.data.url)
    expect(served.status).toBe(200)
    expect(served.headers['x-content-type-options']).toBe('nosniff')
    expect(served.headers['cross-origin-resource-policy']).toBe('cross-origin')
  })

  it('rejects an unsupported file type', async () => {
    const res = await request(app)
      .post('/api/admin/uploads')
      .set(auth())
      .attach('file', Buffer.from('<script>alert(1)</script>'), { filename: 'x.html', contentType: 'text/html' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('UNSUPPORTED_FILE')
  })

  it('rejects a file whose bytes do not match its declared image type, and deletes it', async () => {
    const before = readdirSync(UPLOAD_DIR).length
    const res = await request(app)
      .post('/api/admin/uploads')
      .set(auth())
      .attach('file', Buffer.from('this is definitely not a png'), { filename: 'fake.png', contentType: 'image/png' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('UNSUPPORTED_FILE')
    expect(readdirSync(UPLOAD_DIR).length).toBe(before)
  })

  it('rejects an image larger than 5 MB', async () => {
    const big = Buffer.concat([PNG, Buffer.alloc(5 * 1024 * 1024 + 1, 0)])
    const res = await request(app)
      .post('/api/admin/uploads')
      .set(auth())
      .attach('file', big, { filename: 'big.png', contentType: 'image/png' })
    expect(res.status).toBe(413)
    expect(res.body.error.code).toBe('FILE_TOO_LARGE')
  })

  it('rejects a request with no file', async () => {
    const res = await request(app).post('/api/admin/uploads').set(auth()).field('note', 'no file here')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('NO_FILE')
  })

  it('does not serve arbitrary files from the server', async () => {
    expect(existsSync(UPLOAD_DIR)).toBe(true)
    const res = await request(app).get('/uploads/../package.json')
    expect(res.status).not.toBe(200)
  })
})
