import type {HttpContext} from "@adonisjs/core/http";
import {createStepValidator, updateStepValidator} from "#validators/step";
import app from "@adonisjs/core/services/app";
import {randomUUID} from "node:crypto";
import fs from "node:fs/promises";
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

    if (payload.new_medias) {
      folderId = randomUUID()
      for (const media of payload.new_medias) {
        await media.move(app.makePath(`uploads/${folderId}`))
      }
    }

    const { travel_title, new_medias, ...stepPayload } = payload
    await Step.create({ ...stepPayload, travel_id: travel.id, medias: folderId });

    return response.redirect().back()
  }

  async update({ params, request, response, auth }: HttpContext) {
    const { id } = params
    const payload = await request.validateUsing(updateStepValidator)
    const step = await Step.findOrFail(id)
    let travel = await Travel.find(payload.travel_id)

    if(!travel) {
      travel = await Travel.create({
        title: payload.travel_title,
        userId: auth.user!.id
      })
    } else {
      if(travel.userId !== auth.user!.id) {
        return response.forbidden()
      }
    }

    let folderId: string | null = null

    if (payload.new_medias || payload.old_medias) {
      if(step.medias) {
        folderId = step.medias
      } else {
        folderId = randomUUID()
      }
    }

    if (payload.old_medias && folderId) {
      const allFiles = await fs.readdir(app.makePath(`uploads/${folderId}`))
      await Promise.all(
        allFiles
          .filter(filename => !payload.old_medias!.includes(`${folderId}/${filename}`))
          .map(filename => fs.unlink(app.makePath(`uploads/${folderId}/${filename}`)))
      )
    }

    if (payload.new_medias) {
      for (const media of payload.new_medias) {
        await media.move(app.makePath(`uploads/${folderId}`))
      }
    }

    const { travel_title, new_medias, old_medias, ...stepPayload } = payload
    step.merge({ ...stepPayload, travel_id: travel.id, medias: folderId })
    await step.save()

    return response.redirect().back()
  }

  async destroy({ params, response, auth }: HttpContext) {
    const { id } = params
    const step = await Step.findOrFail(id)
    const travel = await Travel.findOrFail(step.travelId)

    if(travel.userId !== auth.user!.id) {
      return response.forbidden()
    }

    await step.delete()

    const remainingSteps = await Step.query().where('travel_id', travel.id)

    if(remainingSteps.length === 0) {
      await travel.delete()
    }

    return response.redirect().back()
  }
}
