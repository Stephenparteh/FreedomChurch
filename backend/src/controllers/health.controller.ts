import type { Request, Response } from 'express'
import { isDbConnected } from '../config/db.js'
import { env } from '../config/env.js'

export function getHealth(_req: Request, res: Response) {
  const dbConnected = isDbConnected()
  const status = dbConnected ? 'ok' : 'degraded'

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    data: {
      status,
      environment: env.NODE_ENV,
      database: dbConnected ? 'connected' : 'disconnected',
      uptimeSeconds: Math.round(process.uptime()),
    },
  })
}
