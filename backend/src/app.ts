import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env, isProduction } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { apiRouter } from './routes/index.js'
import { UPLOAD_DIR } from './utils/upload.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: env.FRONTEND_URL,
    }),
  )
  app.use(express.json({ limit: '100kb' }))

  if (!isProduction) {
    app.use(morgan('dev'))
  }

  // Uploaded media is public (it appears on the website). It is served with
  // nosniff and a cross-origin resource policy so the frontend origin can embed it.
  app.use(
    '/uploads',
    express.static(UPLOAD_DIR, {
      dotfiles: 'deny',
      index: false,
      setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
      },
    }),
  )

  app.use('/api', apiRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
