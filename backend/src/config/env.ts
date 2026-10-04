import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  FRONTEND_URL: z.string().min(1, 'FRONTEND_URL is required'),
  // Signs admin session tokens. Must be long and random (e.g. `openssl rand -hex 32`).
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  // Directory where uploaded media is stored and served from /uploads.
  UPLOAD_DIR: z.string().min(1).default('uploads'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid or missing environment variables:')
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`)
  }
  throw new Error('Environment validation failed. See backend/.env.example.')
}

export const env = parsed.data
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'
