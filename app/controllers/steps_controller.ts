import type {HttpContext} from "@adonisjs/core/http";
import {createStepValidator} from "#validators/step";
import app from "@adonisjs/core/services/app";
import {randomUUID} from "node:crypto";
import Step from "#models/step";
import Travel from "#models/travel";

export default class StepsController {
  async create({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createStepValidator)
    let travel = await Travel.find(payload.travel_id)

    if(!travel) {
      travel = await Travel.create({
        title: payload.travel_title,
        userId: auth.user!.id
      })
    }

    let folderId: string | null = null

    if (payload.medias) {
      folderId = randomUUID()
      for (const media of payload.medias) {
        await media.move(app.makePath(`uploads/${folderId}`))
      }
    }

    const { travel_title, ...stepPayload } = payload
    await Step.create({ ...stepPayload, travel_id: travel.id, medias: folderId });

    return response.redirect().back()
  }
}
