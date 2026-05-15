import { TravelSchema } from '#database/schema'
import {beforeCreate} from "@adonisjs/lucid/orm";
import {randomUUID} from "node:crypto";

export default class Travel extends TravelSchema {
  @beforeCreate()
  static assignUuid(travel: Travel) {
    travel.id = randomUUID()
  }
}
