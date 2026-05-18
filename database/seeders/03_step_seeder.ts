import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Step from "#models/step";
import Travel from "#models/travel";

export default class extends BaseSeeder {
  async run() {
    const travel = await Travel.findByOrFail('title', 'Amazonie')

    await Step.createMany([
      {
        title: 'Découverte de Manaus et visite de l’Institut National de la Recherche Amazonienne',
        description: 'Tour de Manaus avec Sylvia : centre-ville, Université et Théâtre de l\’Amazonie le matin. Visite de l\’Institut National de la Recherche Amazonienne l\’après-midi.',
        longitude: '-59.982918',
        latitude: '-3.133046',
        place: 'Manaus, Amazonas, Brésil',
        startDate: '2026-04-27',
        endDate: '2026-04-28',
        travelId: travel.id
      },
      {
        title: 'Croisière sur le Rio Negro',
        longitude: '-60.202474',
        latitude: '-3.037174',
        place: 'Rio Negro, Manaus - Amazonas, 69005-000, Brésil',
        startDate: '2026-04-29',
        endDate: '2026-05-26',
        travelId: travel.id
      }
    ])
  }
}
