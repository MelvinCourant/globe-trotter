import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Step from "#models/step";
import Travel from "#models/travel";
import app from "@adonisjs/core/services/app";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export default class extends BaseSeeder {
  async run() {
    const travel = await Travel.findByOrFail('title', 'Amazonie')

    const folderId = randomUUID()
    const imagesDir = app.makePath('database/seeders/images/step')
    const uploadsDir = app.makePath(`uploads/${folderId}`)
    await fs.mkdir(uploadsDir, { recursive: true })

    const images = await fs.readdir(imagesDir)
    await Promise.all(
      images.map((file) => {
        const ext = path.extname(file)
        const newName = `${randomUUID()}${ext}`
        return fs.copyFile(path.join(imagesDir, file), path.join(uploadsDir, newName))
      })
    )

    await Step.create({
      title: 'Découverte de Manaus et visite de l’Institut National de la Recherche Amazonienne',
      description: 'Tour de Manaus avec Sylvia : centre-ville, Université et Théâtre de l\'Amazonie le matin. Visite de l\'Institut National de la Recherche Amazonienne l\'après-midi.',
      longitude: '-59.982918',
      latitude: '-3.133046',
      place: 'Manaus, Amazonas, Brésil',
      startDate: '2026-04-27',
      endDate: '2026-04-28',
      travelId: travel.id,
      medias: folderId,
      link: 'https://www.google.com/'
    })

    await Step.create({
      title: 'Croisière sur le Rio Negro',
      longitude: '-60.202474',
      latitude: '-3.037174',
      place: 'Rio Negro, Manaus - Amazonas, 69005-000, Brésil',
      startDate: '2026-04-29',
      endDate: '2026-05-6',
      travelId: travel.id,
    })
  }
}
