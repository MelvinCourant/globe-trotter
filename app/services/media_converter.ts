import type { MultipartFile } from '@adonisjs/core/bodyparser'
import { readFile, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import drive from '@adonisjs/drive/services/main'

export async function convertHeicToJpg(file: MultipartFile): Promise<void> {
  if (!file.tmpPath || file.extname?.toLowerCase() !== 'heic') return

  const heicConvert = (await import('heic-convert')).default

  const inputBuffer = await readFile(file.tmpPath)
  const outputBuffer = await heicConvert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 1,
  })

  await writeFile(file.tmpPath, Buffer.from(outputBuffer))

  ;(file as any).extname = 'jpg'
  ;(file as any).clientName = file.clientName.replace(/\.heic$/i, '.jpg')
}

const VARIANTS = [
  { suffix: '', width: undefined as number | undefined, height: undefined as number | undefined },
  { suffix: '_small', width: 350, height: 180 },
  { suffix: '_medium', width: 440, height: 226 },
  { suffix: '_large', width: 748, height: 358 },
]

export async function processImageVariants(file: MultipartFile, folderId: string): Promise<string> {
  await convertHeicToJpg(file)

  const sharp = (await import('sharp')).default
  const uuid = randomUUID()
  const inputBuffer = await readFile(file.tmpPath!)

  for (const { suffix, width, height } of VARIANTS) {
    let pipeline = sharp(inputBuffer)
    if (width && height) {
      pipeline = pipeline.resize(width, height, { fit: 'cover' })
    }
    const buffer = await pipeline.webp({ quality: 100 }).toBuffer()
    await drive.use().put(`${folderId}/${uuid}${suffix}.webp`, buffer, {
      contentType: 'image/webp',
    })
  }

  return uuid
}
