import { TravelStepSchema } from '#database/schema'
import { beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class TravelStep extends TravelStepSchema {
  @beforeCreate()
  static assignUuid(travelStep: TravelStep) {
    travelStep.id = randomUUID()
  }
}
