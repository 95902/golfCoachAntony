import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

const corsConfig = defineConfig({
  enabled: env.get('CORS_ENABLED', true),
  origin: env.get('CORS_ORIGIN', 'http://localhost:5173').split(','),
  methods: env.get('CORS_METHODS', 'GET,HEAD,PUT,PATCH,POST,DELETE').split(','),
  headers: true,
  exposeHeaders: [],
  credentials: env.get('CORS_CREDENTIALS', true),
  maxAge: 90,
})

export default corsConfig
