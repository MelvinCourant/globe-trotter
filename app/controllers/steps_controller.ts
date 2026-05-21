import type {HttpContext} from "@adonisjs/core/http";
import {createStepValidator, updateStepValidator} from "#validators/step";
import drive from '@adonisjs/drive/services/main'
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

    if (payload.new_medias) {
      folderId = randomUUID()

      for (const media of payload.new_medias) {
        const newFileName = `${randomUUID()}.${media.extname}`

        await media.moveToDisk(`${folderId}/${newFileName}`)
      }
    }

    const { travel_title, new_medias, ...stepPayload } = payload
    await Step.create({ ...stepPayload, travelId: travel.id, medias: folderId });

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
      const disk = drive.use()
      const { objects } = await disk.listAll(folderId)
      const deleteOps: Promise<void>[] = []

      for (const obj of objects) {
        if (obj.isFile && !payload.old_medias!.includes(obj.key)) {
          deleteOps.push(disk.delete(obj.key))
        }
      }
      await Promise.all(deleteOps)
    }

    if (payload.new_medias) {
      for (const media of payload.new_medias) {
        const newFileName = `${randomUUID()}.${media.extname}`

        await media.moveToDisk(`${folderId}/${newFileName}`)
      }
    }

    const { travel_title, new_medias, old_medias, ...stepPayload } = payload
    step.merge({ ...stepPayload, travelId: travel.id, medias: folderId })
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
