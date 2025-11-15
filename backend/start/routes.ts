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
  /**
   * PUBLIC ROUTES
   */

  // Auth routes (public)
  router.group(() => {
    router.post('/login', '#controllers/auth_controller.login')
    router.post('/logout', '#controllers/auth_controller.logout')
    router.get('/me', '#controllers/auth_controller.me')
  }).prefix('/auth')

  // Time Slots - available slots (public)
  router.group(() => {
    router.get('/available', '#controllers/time_slots_controller.getAvailable')
    router.get('/available-range', '#controllers/time_slots_controller.getAvailableRange')
  }).prefix('/time-slots')

  // Bookings - create booking (public)
  router.post('/bookings', '#controllers/bookings_controller.store')

  /**
   * AUTHENTICATED ROUTES
   */
  router.group(() => {
    // Bookings (authenticated users can view/modify their own bookings)
    router.get('/bookings', '#controllers/bookings_controller.index')
    router.get('/bookings/:id', '#controllers/bookings_controller.show')
    router.put('/bookings/:id', '#controllers/bookings_controller.update')
    router.delete('/bookings/:id', '#controllers/bookings_controller.destroy')

    // Customers (read-only for authenticated users)
    router.get('/customers', '#controllers/customers_controller.index')
    router.get('/customers/:id', '#controllers/customers_controller.show')
  }).use([() => import('#middleware/auth')])

  /**
   * ADMIN ROUTES (COACH or ADMIN only)
   */
  router
    .group(() => {
      // Schedules management
      router.get('/schedules', '#controllers/schedules_controller.index')
      router.post('/schedules/slots', '#controllers/schedules_controller.addSlot')
      router.delete('/schedules/slots/:id', '#controllers/schedules_controller.removeSlot')
      router.post('/schedules/regenerate', '#controllers/schedules_controller.regenerate')

      // Customers management (CRUD)
      router.post('/customers', '#controllers/customers_controller.store')
      router.put('/customers/:id', '#controllers/customers_controller.update')
      router.delete('/customers/:id', '#controllers/customers_controller.destroy')
    })
    .prefix('/admin')
    .use([() => import('#middleware/auth'), () => import('#middleware/admin')])
}).prefix('/api')
