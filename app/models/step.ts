import { StepSchema } from '#database/schema'
import {beforeCreate} from "@adonisjs/lucid/orm";
import {randomUUID} from "node:crypto";

export default class Step extends StepSchema {
  @beforeCreate()
  static assignUuid(step: Step) {
    step.id = randomUUID()
  }
}
