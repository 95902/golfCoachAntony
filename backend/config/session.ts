import env from '#start/env'
import { defineConfig, stores } from '@adonisjs/session'

const sessionConfig = defineConfig({
  enabled: true,
  driver: env.get('SESSION_DRIVER', 'cookie'),
  cookieName: 'golf_coach_session',
  clearWithBrowser: false,
  age: '2h',
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax',
  },
  stores: {
    cookie: stores.cookie(),
  },
})

export default sessionConfig

declare module '@adonisjs/session/types' {
  export interface SessionStoresList extends InferSessionStores<typeof sessionConfig> {}
}
