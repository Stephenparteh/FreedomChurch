import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { countImages } from '../src/media/storage.js'
import { SermonModel } from '../src/models/Sermon.js'
import { GalleryItemModel } from '../src/models/GalleryItem.js'
import { clearTestDb, loginAsTestAdmin, setupTestDb, teardownTestDb } from './helpers.js'

const app = createApp()
let token = ''
const auth = () => ({ Authorization: `Bearer ${token}` })

// A tiny valid PNG (signature + padding): a real image fixture.
const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64, 0)])

async function upload(buffer = PNG, contentType = 'image/png', filename = 'photo.png') {
  return request(app).post('/api/admin/uploads').set(auth()).attach('file', buffer, { filename, contentType })
}

const sermonBody = (over: Record<string, unknown> = {}) => ({
  title: 'Media Test Sermon',
  description: 'Temporary sermon for media tests.',
  speaker: 'Test Speaker',
  date: '2026-01-04T00:00:00.000Z',
  ...over,
})

describe('Media storage (GridFS, persistent in the database)', () => {
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

  it('rejects unauthenticated uploads', async () => {
    const res = await request(app).post('/api/admin/uploads').attach('file', PNG, { filename: 'a.png', contentType: 'image/png' })
    expect(res.status).toBe(401)
  })

  it('stores a real PNG under a server-generated name and serves it with safe headers', async () => {
    const res = await upload()
    expect(res.status).toBe(201)
    expect(res.body.data.url).toMatch(/^\/uploads\/[0-9a-f-]{36}\.png$/)
    expect(res.body.data.url).not.toContain('photo')

    const served = await request(app).get(res.body.data.url)
    expect(served.status).toBe(200)
    expect(served.headers['content-type']).toBe('image/png')
    expect(served.headers['x-content-type-options']).toBe('nosniff')
    expect(served.headers['cross-origin-resource-policy']).toBe('cross-origin')
    expect(served.headers['cache-control']).toContain('immutable')
    expect(Buffer.compare(served.body, PNG)).toBe(0)
  })

  it('rejects an unsupported file type and stores nothing', async () => {
    const res = await upload(Buffer.from('<script>alert(1)</script>'), 'text/html', 'x.html')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('UNSUPPORTED_FILE')
    expect(await countImages()).toBe(0)
  })

  it('rejects a file whose bytes do not match its declared type and stores nothing', async () => {
    const res = await upload(Buffer.from('this is definitely not a png'), 'image/png', 'fake.png')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('UNSUPPORTED_FILE')
    expect(await countImages()).toBe(0)
  })

  it('rejects an image larger than 5 MB', async () => {
    const big = Buffer.concat([PNG, Buffer.alloc(5 * 1024 * 1024 + 1, 0)])
    const res = await upload(big, 'image/png', 'big.png')
    expect(res.status).toBe(413)
    expect(res.body.error.code).toBe('FILE_TOO_LARGE')
  })

  it('rejects a request with no file', async () => {
    const res = await request(app).post('/api/admin/uploads').set(auth()).field('note', 'no file here')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('NO_FILE')
  })

  it('does not serve anything except server-generated upload names', async () => {
    expect((await request(app).get('/uploads/../package.json')).status).toBe(404)
    expect((await request(app).get('/uploads/evil.html')).status).toBe(404)
    expect((await request(app).get('/uploads/00000000-0000-0000-0000-000000000000.png')).status).toBe(404)
  })
})

describe('Media cleanup when records change or are deleted', () => {
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

  it('removes the stored file when the only record using it is deleted', async () => {
    const file = await upload()
    const created = await request(app).post('/api/admin/sermons').set(auth()).send(sermonBody({ thumbnail: file.body.data.url }))
    expect(await countImages()).toBe(1)

    await request(app).delete(`/api/admin/sermons/${created.body.data.id}`).set(auth())
    expect(await countImages()).toBe(0)
    expect((await request(app).get(file.body.data.url)).status).toBe(404)
  })

  it('keeps the file while another record still references it', async () => {
    const file = await upload()
    const url = file.body.data.url
    const a = await request(app).post('/api/admin/sermons').set(auth()).send(sermonBody({ thumbnail: url }))
    await request(app).post('/api/admin/sermons').set(auth()).send(sermonBody({ title: 'Second', thumbnail: url }))

    await request(app).delete(`/api/admin/sermons/${a.body.data.id}`).set(auth())
    expect(await countImages()).toBe(1)
    expect((await request(app).get(url)).status).toBe(200)
  })

  it('removes the old file when a record is given a different image', async () => {
    const first = await upload()
    const second = await upload()
    const created = await request(app).post('/api/admin/gallery').set(auth()).send({
      imageUrl: first.body.data.url,
      altText: 'A photo',
      isPublished: true,
    })
    await request(app).patch(`/api/admin/gallery/${created.body.data.id}`).set(auth()).send({ imageUrl: second.body.data.url })

    expect(await countImages()).toBe(1)
    expect((await request(app).get(first.body.data.url)).status).toBe(404)
    expect((await request(app).get(second.body.data.url)).status).toBe(200)
  })

  it('never deletes seeded or external media references', async () => {
    await GalleryItemModel.create({ imageUrl: '/photos/congregation-worship.webp', altText: 'Seeded', isPublished: true })
    await request(app).delete(`/api/admin/gallery/${(await GalleryItemModel.findOne())!.id}`).set(auth())
    // Nothing in GridFS was touched, and no error occurred.
    expect(await countImages()).toBe(0)
    expect(await SermonModel.countDocuments()).toBe(0)
  })
})
