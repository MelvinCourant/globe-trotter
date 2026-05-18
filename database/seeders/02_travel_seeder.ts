import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Travel from '#models/travel'
import User from "#models/user";

export default class extends BaseSeeder {
  async run() {
    const user = await User.findByOrFail('email', 'test@test.fr')

    await Travel.createMany([
      {
        title: 'Amazonie',
        userId: user.id
      },
      {
        title: 'France',
        userId: user.id
      },
    ])
  }
}
