import { StepSchema } from '#database/schema'
import { afterFetch, afterFind, beforeCreate } from "@adonisjs/lucid/orm";
import { randomUUID } from "node:crypto";
import drive from '@adonisjs/drive/services/main'

type MediaVariants = {
  normal: string
  small: string
  medium: string
  large: string
}

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
        const variantMap = new Map<string, Partial<MediaVariants>>()

        for (const obj of objects) {
          if (!obj.isFile) continue
          const filename = obj.key.split('/').pop()!

          let variant: keyof MediaVariants
          let baseUuid: string

          if (filename.endsWith('_small.webp')) {
            variant = 'small'
            baseUuid = filename.slice(0, -'_small.webp'.length)
          } else if (filename.endsWith('_medium.webp')) {
            variant = 'medium'
            baseUuid = filename.slice(0, -'_medium.webp'.length)
          } else if (filename.endsWith('_large.webp')) {
            variant = 'large'
            baseUuid = filename.slice(0, -'_large.webp'.length)
          } else {
            variant = 'normal'
            baseUuid = filename.replace(/\.[^.]+$/, '')
          }

          if (!variantMap.has(baseUuid)) {
            variantMap.set(baseUuid, {})
          }
          variantMap.get(baseUuid)![variant] = obj.key
        }

        step.$extras.mediaFiles = Array.from(variantMap.values())
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