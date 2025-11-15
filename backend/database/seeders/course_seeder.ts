import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Course from '#models/course'

export default class extends BaseSeeder {
  async run() {
    const courses = [
      {
        name: 'Golf d\'Omerson',
        location: 'Ormoy, France',
        description: 'Magnifique parcours 18 trous en pleine nature',
      },
      {
        name: 'Golf Disneyland Paris',
        location: 'Disneyland Paris, France',
        description: 'Parcours de golf 27 trous à proximité de Disneyland Paris',
      },
      {
        name: 'Golf de Saint-Quentin-en-Yvelines',
        location: 'Saint-Quentin-en-Yvelines, France',
        description: 'Complexe de golf avec 2 parcours 18 trous',
      },
      {
        name: 'Golf de Fontainebleau',
        location: 'Fontainebleau, France',
        description: 'Parcours 18 trous en forêt de Fontainebleau',
      },
      {
        name: 'Golf de Courson',
        location: 'Courson-Monteloup, France',
        description: 'Parcours 18 trous technique et vallonné',
      },
    ]

    for (const courseData of courses) {
      await Course.updateOrCreate({ name: courseData.name }, courseData)
    }

    console.log('✅ Courses seeded successfully')
  }
}
