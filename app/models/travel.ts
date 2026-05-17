import { TravelSchema } from '#database/schema'
import { beforeCreate, hasMany } from "@adonisjs/lucid/orm";
import { randomUUID } from "node:crypto";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import Step from "#models/step";

export default class Travel extends TravelSchema {
  @hasMany(() => Step)
  declare steps: HasMany<typeof Step>

  @beforeCreate()
  static assignUuid(travel: Travel) {
    travel.id = randomUUID()
  }
}
