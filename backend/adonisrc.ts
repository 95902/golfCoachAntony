import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  directories: {
    config: 'config',
    public: 'public',
    contracts: 'contracts',
    providers: 'providers',
    languageFiles: 'resources/lang',
    migrations: 'database/migrations',
    seeders: 'database/seeders',
    factories: 'database/factories',
    views: 'resources/views',
    start: 'start',
    tmp: 'tmp',
    httpControllers: 'app/controllers',
    models: 'app/models',
    services: 'app/services',
    exceptions: 'app/exceptions',
    mails: 'app/mails',
    middleware: 'app/middleware',
    policies: 'app/policies',
    validators: 'app/validators',
  },
  providers: [
    () => import('@adonisjs/core/providers/app_provider'),
    () => import('@adonisjs/core/providers/hash_provider'),
    () => import('@adonisjs/lucid/database_provider'),
    () => import('@adonisjs/auth/auth_provider'),
    () => import('@adonisjs/session/session_provider'),
    () => import('@adonisjs/cors/cors_provider'),
    () => import('@adonisjs/shield/shield_provider'),
  ],
  preloads: [
    () => import('./start/routes.js'),
  ],
  metaFiles: [
    {
      pattern: 'public/**',
      reloadServer: false,
    },
  ],
  commands: [
    () => import('@adonisjs/core/commands'),
    () => import('@adonisjs/lucid/commands'),
  ],
  tests: {
    suites: [],
  },
})
