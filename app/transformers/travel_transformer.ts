import { BaseTransformer } from '@adonisjs/core/transformers'
import type Travel from '#models/travel'

export default class TravelTransformer extends BaseTransformer<Travel> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'title'
    ])
  }
}
