import type { HttpContext } from '@adonisjs/core/http'
import { createTravelValidator } from '#validators/travel'
import Travel from '#models/travel'

export default class TravelsController {
  async create({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createTravelValidator)
    const travel = await Travel.create({ ...payload, userId: auth.user!.id })

    return response.created(travel)
  }

  async index({ response, auth }: HttpContext) {
    const travels = await Travel.query()
      .where('user_id', auth.user!.id)
      .select('id', 'title')
      .orderBy('title', 'asc')

    return response.status(200).send(travels)
  }
}
