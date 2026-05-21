import { StepSchema } from '#database/schema'
import { afterFetch, afterFind, beforeCreate } from "@adonisjs/lucid/orm";
import { randomUUID } from "node:crypto";
import drive from '@adonisjs/drive/services/main'

export default class Step extends StepSchema {
  @beforeCreate()
  static assignUuid(step: Step) {
    step.id = randomUUID()
  }

  @afterFind()
  static async loadMedias(step: Step) {
    if (step.medias) {
      try {
        const { objects } = await drive.use().listAll(step.medias)
        const files: string[] = []

        for (const obj of objects) {
          if (obj.isFile) files.push(obj.key)
        }

        step.$extras.mediaFiles = files
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
