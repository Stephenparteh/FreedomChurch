import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  FRONTEND_URL: z.string().min(1, 'FRONTEND_URL is required'),
  // Not used until Milestone 4 (admin auth) — validated now so the env
  // contract is stable and documented ahead of time, per docs/BACKEND_PLAN.md.
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
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
