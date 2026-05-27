import type { HttpContext } from '@adonisjs/core/http'
import { createTravelValidator } from '#validators/travel'
import Travel from '#models/travel'
import User from "#models/user";

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

  async indexStepsTravels({ response, auth }: HttpContext) {
    const travels = await Travel.query()
      .where('user_id', auth.user!.id)
      .select('id', 'title')
      .preload('steps', (query) => query.orderBy('end_date', 'asc'))
      .orderBy('title', 'asc')

    return response.status(200).send(travels)
  }

  async indexShared({ params, response }: HttpContext) {
    const { shareLinkId } = params
    const userSharing = await User.query()
      .where('share_link', shareLinkId)
      .select('id')
      .first()

    if (!userSharing) {
      return response.status(404).send({ message: 'Share link not found' })
    }

    const travels = await Travel.query()
      .where('user_id', userSharing.id)
      .select('id', 'title')
      .preload('steps', (query) => query.orderBy('end_date', 'asc'))
      .orderBy('title', 'asc')

    return response.status(200).send(travels)
  }

  async search({ request, response, auth }: HttpContext) {
    const search = request.input('search') as string | undefined
    const travelId = request.input('travel') as string | undefined

    if (!search && !travelId) {
      return response.status(200).send([])
    }

    const query = Travel.query()
      .where('user_id', auth.user!.id)
      .select('id', 'title')
      .orderBy('title', 'asc')

    if (travelId) {
      query.where('id', travelId)
    }

    if (search && !travelId) {
      query.whereHas('steps', (q) => {
        q.where((inner) => {
          inner
            .whereILike('title', `%${search}%`)
            .orWhereILike('description', `%${search}%`)
            .orWhereILike('place', `%${search}%`)
        })
      })
    }

    query.preload('steps', (stepsQuery) => {
      if (search) {
        stepsQuery.where((q) => {
          q.whereILike('title', `%${search}%`)
            .orWhereILike('description', `%${search}%`)
            .orWhereILike('place', `%${search}%`)
        })
      }
      stepsQuery.orderBy('end_date', 'asc')
    })

    const travels = await query

    return response.status(200).send(travels)
  }
}
