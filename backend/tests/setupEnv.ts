import { randomUUID } from 'node:crypto'
import { inject } from 'vitest'

// Runs before each test file's imports are evaluated, so env.ts's
// eager validation (see src/config/env.ts) sees a valid environment.
process.env.NODE_ENV = 'test'

// All test files share ONE physical in-memory mongod (started once in
// vitest.globalSetup.ts, for speed) but vitest runs test FILES in
// parallel — so each file gets its own logical database on that shared
// server. Without this, one file's afterEach(clearTestDb) would wipe
// collections while another file's test was mid-assertion.
const baseUri = inject('mongoUri')
process.env.MONGODB_URI = `${baseUri}test_${randomUUID().replace(/-/g, '')}`

process.env.FRONTEND_URL = 'http://localhost:5173'
process.env.JWT_SECRET = 'test-secret-not-for-production-0123456789'
// Tests exercise the Express app directly via supertest — nothing ever
// binds this port — but env.ts still requires a valid positive value.
process.env.PORT = '5099'
