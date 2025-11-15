import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  TZ: Env.schema.string(),
  PORT: Env.schema.number(),
  HOST: Env.schema.string(),
  LOG_LEVEL: Env.schema.string(),
  APP_KEY: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),

  // Database
  DB_HOST: Env.schema.string(),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string(),
  DB_DATABASE: Env.schema.string(),

  // Session
  SESSION_DRIVER: Env.schema.string(),

  // CORS
  CORS_ENABLED: Env.schema.boolean.optional(),
  CORS_ORIGIN: Env.schema.string.optional(),
  CORS_METHODS: Env.schema.string.optional(),
  CORS_HEADERS: Env.schema.string.optional(),
  CORS_CREDENTIALS: Env.schema.boolean.optional(),

  // N8N Webhooks
  N8N_WEBHOOK_URL: Env.schema.string.optional(),
})
