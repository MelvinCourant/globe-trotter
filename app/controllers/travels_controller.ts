import type { HttpContext } from '@adonisjs/core/http'
import { createTravelValidator } from '#validators/travel'
import Travel from '#models/travel'

export default class TravelsController {
  async create({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createTravelValidator)
    const travel = await Travel.create({ ...payload, userId: auth.user!.id })

    return response.created(travel)
  }
}