import vine from '@vinejs/vine'

export const createStepValidator = vine.create({
  title: vine.string().maxLength(100),
  description: vine.string().maxLength(500).optional(),
  longitude: vine.number().decimal([1, 7]),
  latitude: vine.number().decimal([1, 7]),
  place: vine.string().maxLength(100),
  start_date: vine.date({ formats: ['YYYY-MM-DD'] }),
  end_date: vine.date({ formats: ['YYYY-MM-DD'] }),
  new_medias: vine.array(vine.file({ size: '8mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })).maxLength(15).optional(),
  link: vine.string().url().optional(),
  travel_id: vine.string().uuid(),
  travel_title: vine.string()
})

export const updateStepValidator = vine.create({
  title: vine.string().maxLength(100),
  description: vine.string().maxLength(500).optional(),
  longitude: vine.number().decimal([1, 7]),
  latitude: vine.number().decimal([1, 7]),
  place: vine.string().maxLength(100),
  start_date: vine.date({ formats: ['YYYY-MM-DD'] }),
  end_date: vine.date({ formats: ['YYYY-MM-DD'] }),
  new_medias: vine.array(vine.file({ size: '8mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })).maxLength(15).optional(),
  old_medias: vine.array(vine.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp)$/i)).maxLength(15).optional(),
  link: vine.string().url().optional(),
  travel_id: vine.string().uuid(),
  travel_title: vine.string()
})
