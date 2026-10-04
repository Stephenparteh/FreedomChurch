import { createApp } from './app.js'
import { connectDb, disconnectDb } from './config/db.js'
import { env } from './config/env.js'

async function main() {
  // Fail loudly at boot if the database is unreachable — see config/db.ts.
  await connectDb()

  const app = createApp()
  const server = app.listen(env.PORT, () => {
    console.log(`[server] listening on port ${env.PORT} (${env.NODE_ENV})`)
  })

  async function shutdown(signal: string) {
    console.log(`[server] received ${signal}, shutting down...`)
    server.close(async () => {
      await disconnectDb()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}

main().catch((err) => {
  console.error('[server] failed to start:', err instanceof Error ? err.message : err)
  process.exit(1)
})
