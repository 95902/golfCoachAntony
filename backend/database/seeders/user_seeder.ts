import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // Create admin user
    await User.updateOrCreate(
      { email: 'admin@golfcoach.com' },
      {
        username: 'admin',
        password: 'Admin123!', // Will be hashed automatically by the model
        role: 'ADMIN',
      }
    )

    // Create coach user
    await User.updateOrCreate(
      { email: 'antony@golfcoach.com' },
      {
        username: 'antony',
        password: 'Coach123!', // Will be hashed automatically
        role: 'COACH',
      }
    )

    // Create a test user
    await User.updateOrCreate(
      { email: 'user@test.com' },
      {
        username: 'testuser',
        password: 'User123!',
        role: 'USER',
      }
    )

    console.log('✅ Users seeded successfully')
  }
}
