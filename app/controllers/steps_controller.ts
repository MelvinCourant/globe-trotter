import type {HttpContext} from "@adonisjs/core/http";
import {createStepValidator, updateStepValidator} from "#validators/step";
import drive from '@adonisjs/drive/services/main'
import {randomUUID} from "node:crypto";
import Step from "#models/step";
import Travel from "#models/travel";
import { processImageVariants } from "#services/media_converter";

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
    const mediasOrder: string[] = []

    if (payload.new_medias) {
      folderId = randomUUID()

      for (const media of payload.new_medias) {
        const uuid = await processImageVariants(media, folderId)
        mediasOrder.push(uuid)
      }
    }

    const { travel_title, new_medias, ...stepPayload } = payload
    await Step.create({
      ...stepPayload,
      travelId: travel.id,
      medias: folderId,
      mediasOrder: mediasOrder.length > 0 ? mediasOrder : null,
    });

    return response.redirect().back()
  }

  async update({ params, request, response, auth }: HttpContext) {
    const { id } = params
    const payload = await request.validateUsing(updateStepValidator)

    const totalMedias = (payload.old_medias?.length ?? 0) + (payload.new_medias?.length ?? 0)
    if (totalMedias > 15) {
      return response.unprocessableEntity({ message: 'Le nombre total de médias ne peut pas dépasser 15.' })
    }

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

    const orderedUuids: string[] = []
    const newMediaUuids: string[] = []

    if (payload.old_medias && folderId) {
      const disk = drive.use()
      const { objects } = await disk.listAll(folderId)
      const deleteOps: Promise<void>[] = []

      const keepUuids = new Set(
        payload.old_medias.map((key) => {
          const filename = key.split('/').pop()!
          return filename.replace(/(_small|_medium|_large)?\.webp$/i, '').replace(/\.(jpg|jpeg|png|heic)$/i, '')
        })
      )

      for (const obj of objects) {
        if (obj.isFile) {
          const filename = obj.key.split('/').pop()!
          const baseUuid = filename.replace(/(_small|_medium|_large)?\.webp$/i, '').replace(/\.(jpg|jpeg|png|heic)$/i, '')
          if (!keepUuids.has(baseUuid)) {
            deleteOps.push(disk.delete(obj.key))
          }
        }
      }
      await Promise.all(deleteOps)
    }

    if (payload.new_medias) {
      for (const media of payload.new_medias) {
        const uuid = await processImageVariants(media, folderId!)
        newMediaUuids.push(uuid)
      }
    }

    if (payload.medias_order_refs) {
      try {
        const refs = JSON.parse(payload.medias_order_refs) as string[]
        for (const ref of refs) {
          if (ref.startsWith('old:')) {
            const filename = ref.slice(4).split('/').pop()!
            orderedUuids.push(filename.replace(/\.[^.]+$/, ''))
          } else if (ref.startsWith('new:')) {
            const newIndex = parseInt(ref.slice(4), 10)
            if (newMediaUuids[newIndex] !== undefined) orderedUuids.push(newMediaUuids[newIndex])
          }
        }
      } catch {
        for (const path of payload.old_medias ?? []) {
          orderedUuids.push(path.split('/').pop()!.replace(/\.[^.]+$/, ''))
        }
        orderedUuids.push(...newMediaUuids)
      }
    } else {
      for (const path of payload.old_medias ?? []) {
        orderedUuids.push(path.split('/').pop()!.replace(/\.[^.]+$/, ''))
      }
      orderedUuids.push(...newMediaUuids)
    }

    const { travel_title, new_medias, old_medias, medias_order_refs, ...stepPayload } = payload
    step.merge({
      ...stepPayload,
      description: payload.description ?? null,
      link: payload.link ?? null,
      travelId: travel.id,
      medias: folderId,
      mediasOrder: orderedUuids.length > 0 ? orderedUuids : null,
    })
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