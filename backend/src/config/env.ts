import 'dotenv/config'
import { z } from 'zod'

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    FRONTEND_URL: z.url({ protocol: /^https?$/, error: 'FRONTEND_URL must be a full http(s) URL' }),
    // Signs admin session tokens. Must be long and random (e.g. `openssl rand -hex 32`).
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    // Session lifetime, in the format jsonwebtoken accepts (e.g. "8h", "1d").
    JWT_EXPIRES_IN: z.string().min(1).default('8h'),
    // Number of reverse-proxy hops in front of the API (0 when none). Needed so the
    // login rate limit sees the real client IP on a hosted platform.
    TRUST_PROXY: z.coerce.number().int().min(0).max(10).default(0),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production' && !env.FRONTEND_URL.startsWith('https://')) {
      ctx.addIssue({
        code: 'custom',
        path: ['FRONTEND_URL'],
        message: 'FRONTEND_URL must use https:// in production',
      })
    }
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
