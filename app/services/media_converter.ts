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

export type Crop = { x: number; y: number }

const VARIANTS = [
  { suffix: '', width: undefined as number | undefined, height: undefined as number | undefined },
  { suffix: '_small', width: 350, height: 180 },
  { suffix: '_medium', width: 440, height: 226 },
  { suffix: '_large', width: 748, height: 358 },
]

const hasFocalCrop = (crop?: Crop): crop is Crop => !!crop && (crop.x !== 50 || crop.y !== 50)

function focalExtract(srcWidth: number, srcHeight: number, width: number, height: number, crop: Crop) {
  const scale = Math.max(width / srcWidth, height / srcHeight)
  const scaledWidth = Math.round(srcWidth * scale)
  const scaledHeight = Math.round(srcHeight * scale)
  const overflowX = scaledWidth - width
  const overflowY = scaledHeight - height
  const left = Math.min(Math.max(Math.round((overflowX * crop.x) / 100), 0), overflowX)
  const top = Math.min(Math.max(Math.round((overflowY * crop.y) / 100), 0), overflowY)

  return { scaledWidth, scaledHeight, left, top }
}

async function buildVariants(
  inputBuffer: Buffer,
  folderId: string,
  uuid: string,
  crop: Crop | undefined,
  includeFull: boolean
): Promise<void> {
  const sharp = (await import('sharp')).default
  const useCrop = hasFocalCrop(crop)
  const metadata = useCrop ? await sharp(inputBuffer).metadata() : null

  for (const { suffix, width, height } of VARIANTS) {
    if (!width || !height) {
      if (!includeFull) continue
      const buffer = await sharp(inputBuffer).webp({ quality: 100 }).toBuffer()
      await drive.use().put(`${folderId}/${uuid}${suffix}.webp`, buffer, { contentType: 'image/webp' })
      continue
    }

    let pipeline = sharp(inputBuffer)
    if (useCrop && metadata?.width && metadata?.height) {
      const { scaledWidth, scaledHeight, left, top } = focalExtract(metadata.width, metadata.height, width, height, crop!)
      pipeline = pipeline.resize(scaledWidth, scaledHeight).extract({ left, top, width, height })
    } else {
      pipeline = pipeline.resize(width, height, { fit: 'cover' })
    }

    const buffer = await pipeline.webp({ quality: 100 }).toBuffer()
    await drive.use().put(`${folderId}/${uuid}${suffix}.webp`, buffer, { contentType: 'image/webp' })
  }
}

export async function processImageVariants(
  file: MultipartFile,
  folderId: string,
  crop?: Crop
): Promise<string> {
  await convertHeicToJpg(file)

  const uuid = randomUUID()
  const inputBuffer = await readFile(file.tmpPath!)

  await buildVariants(inputBuffer, folderId, uuid, crop, true)

  return uuid
}

export async function recropImageVariants(folderId: string, uuid: string, crop: Crop): Promise<void> {
  const bytes = await drive.use().getBytes(`${folderId}/${uuid}.webp`)
  const inputBuffer = Buffer.from(bytes)

  await buildVariants(inputBuffer, folderId, uuid, crop, false)
}
