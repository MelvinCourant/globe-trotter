import { StepSchema } from '#database/schema'
import { afterFetch, afterFind, beforeCreate, belongsTo, column } from "@adonisjs/lucid/orm";
import { randomUUID } from "node:crypto";
import drive from '@adonisjs/drive/services/main'
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import Travel from '#models/travel'

type MediaVariants = {
  normal: string
  small: string
  medium: string
  large: string
}

export default class Step extends StepSchema {
  @belongsTo(() => Travel)
  declare travel: BelongsTo<typeof Travel>

  @column({
    prepare: (value: string[] | null) => value !== null ? JSON.stringify(value) : null,
    consume: (value: string | string[] | null) => {
      if (!value) return null
      if (Array.isArray(value)) return value
      try { return JSON.parse(value) } catch { return null }
    },
  })
  declare mediasOrder: string[] | null

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

        const entries = Array.from(variantMap.entries())

        if (step.mediasOrder && step.mediasOrder.length > 0) {
          entries.sort(([uuidA], [uuidB]) => {
            const indexA = step.mediasOrder!.indexOf(uuidA)
            const indexB = step.mediasOrder!.indexOf(uuidB)
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
          })
        }

        step.$extras.mediaFiles = entries.map(([, variants]) => variants)
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
