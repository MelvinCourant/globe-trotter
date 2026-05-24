import type { MultipartFile } from '@adonisjs/core/bodyparser'
import { readFile, writeFile } from 'node:fs/promises'

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
