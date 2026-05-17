import { StepSchema } from '#database/schema'
import { afterFetch, afterFind, beforeCreate } from "@adonisjs/lucid/orm";
import { randomUUID } from "node:crypto";
import app from "@adonisjs/core/services/app";
import fs from 'node:fs/promises'

export default class Step extends StepSchema {
  @beforeCreate()
  static assignUuid(step: Step) {
    step.id = randomUUID()
  }

  @afterFind()
  static async loadMedias(step: Step) {
    if (step.medias) {
      try {
        const files = await fs.readdir(app.makePath(`uploads/${step.medias}`))
        step.$extras.mediaFiles = files.map(file => `${step.medias}/${file}`)
      } catch {
        step.$extras.mediaFiles = []
      }
    } else {
      step.$extras.mediaFiles = []
    }
  }

  @afterFetch()
  static async loadAllMedias(steps: Step[]) {
    await Promise.all(steps.map(Step.loadMedias))
  }

  serialize() {
    const serialized = super.serialize()
    serialized.medias = this.$extras.mediaFiles ?? []
    return serialized
  }
}
