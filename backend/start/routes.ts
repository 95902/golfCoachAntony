import router from '@adonisjs/core/services/router'

// Health check endpoint
router.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Golf Coach API',
    version: '1.0.0',
  }
})

// API routes
router.group(() => {
  // Auth routes (public)
  router.group(() => {
    router.post('/login', '#controllers/auth_controller.login')
    router.post('/logout', '#controllers/auth_controller.logout')
    router.get('/me', '#controllers/auth_controller.me')
  }).prefix('/auth')

  // Booking routes (public - for creating bookings)
  router.group(() => {
    router.get('/available', '#controllers/time_slots_controller.getAvailable')
    router.post('/', '#controllers/bookings_controller.store')
  }).prefix('/bookings')

  // Protected routes (require authentication)
  router.group(() => {
    // Bookings (authenticated users)
    router.get('/bookings', '#controllers/bookings_controller.index')
    router.get('/bookings/:id', '#controllers/bookings_controller.show')
    router.put('/bookings/:id', '#controllers/bookings_controller.update')
    router.delete('/bookings/:id', '#controllers/bookings_controller.destroy')

    // Customers
    router.get('/customers', '#controllers/customers_controller.index')
    router.get('/customers/:id', '#controllers/customers_controller.show')

    // Admin routes (require COACH or ADMIN role)
    router.group(() => {
      // Schedules management
      router.get('/schedules', '#controllers/schedules_controller.index')
      router.post('/schedules/:id/slots', '#controllers/schedules_controller.addSlot')
      router.delete('/schedules/slots/:id', '#controllers/schedules_controller.removeSlot')
      router.post('/schedules/regenerate', '#controllers/schedules_controller.regenerate')

      // Customers management
      router.post('/customers', '#controllers/customers_controller.store')
      router.put('/customers/:id', '#controllers/customers_controller.update')
      router.delete('/customers/:id', '#controllers/customers_controller.destroy')
    }).prefix('/admin')
  }).use([
    () => import('#middleware/auth'),
  ])
}).prefix('/api')
