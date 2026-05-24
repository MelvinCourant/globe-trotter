import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Step from '#models/step'
import drive from '@adonisjs/drive/services/main'

const VARIANTS = [
  { suffix: '', width: undefined as number | undefined, height: undefined as number | undefined },
  { suffix: '_small', width: 350, height: 180 },
  { suffix: '_medium', width: 440, height: 226 },
  { suffix: '_large', width: 748, height: 358 },
]

export default class MigrateMedias extends BaseCommand {
  static commandName = 'medias:migrate'
  static description = 'Convert existing step medias to WebP with all size variants'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const sharp = (await import('sharp')).default
    const disk = drive.use()

    const steps = await Step.query().whereNotNull('medias')
    this.logger.info(`${steps.length} step(s) with medias found`)

    let processed = 0
    let skipped = 0
    let errors = 0

    for (const step of steps) {
      const folderId = step.medias!

      try {
        const { objects } = await disk.listAll(folderId)
        const files = Array.from(objects).filter((o) => o.isFile)

        const processedUuids = new Set(
          files
            .filter((o) => o.key.split('/').pop()!.endsWith('_small.webp'))
            .map((o) => o.key.split('/').pop()!.slice(0, -'_small.webp'.length))
        )

        const sourceFiles = files.filter((o) => {
          const filename = o.key.split('/').pop()!
          return (
            !filename.endsWith('_small.webp') &&
            !filename.endsWith('_medium.webp') &&
            !filename.endsWith('_large.webp')
          )
        })

        for (const sourceFile of sourceFiles) {
          const filename = sourceFile.key.split('/').pop()!
          const baseUuid = filename.replace(/\.[^.]+$/, '')

          if (processedUuids.has(baseUuid)) {
            skipped++
            continue
          }

          try {
            const inputBytes = await disk.getBytes(sourceFile.key)
            const isWebp = filename.endsWith('.webp')

            for (const { suffix, width, height } of VARIANTS) {
              if (suffix === '' && isWebp) continue

              let pipeline = sharp(Buffer.from(inputBytes))
              if (width && height) {
                pipeline = pipeline.resize(width, height, { fit: 'cover' })
              }
              const buffer = await pipeline.webp({ quality: 80 }).toBuffer()
              await disk.put(`${folderId}/${baseUuid}${suffix}.webp`, buffer, {
                contentType: 'image/webp',
              })
            }

            if (!isWebp) {
              await disk.delete(sourceFile.key)
            }

            processed++
            this.logger.info(`Converted: ${sourceFile.key}`)
          } catch (err: any) {
            errors++
            this.logger.error(`Failed: ${sourceFile.key} — ${err.message}`)
          }
        }
      } catch (err: any) {
        errors++
        this.logger.error(`Step ${step.id}: ${err.message}`)
      }
    }

    this.logger.success(`Done — converted: ${processed}, skipped: ${skipped}, errors: ${errors}`)
  }
}