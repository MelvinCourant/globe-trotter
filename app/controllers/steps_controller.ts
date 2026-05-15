import type {HttpContext} from "@adonisjs/core/http";
import {createStepValidator} from "#validators/step";
import app from "@adonisjs/core/services/app";
import {randomUUID} from "node:crypto";
import Step from "#models/step";
import Travel from "#models/travel";
import TravelStep from "#models/travel_step";

export default class StepsController {
  async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createStepValidator)
    const travel = await Travel.findOrFail(payload.travel_id)

    let folderId: string | null = null

    if (payload.medias) {
      folderId = randomUUID()
      for (const media of payload.medias) {
        await media.move(app.makePath(`uploads/${folderId}`))
      }
    }

    const step = await Step.create({ ...payload, medias: folderId })

    await TravelStep.create({
      travelId: travel.id,
      stepId: step.id
    })

    return response.created(step)
  }
}
