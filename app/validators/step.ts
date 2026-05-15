import vine from '@vinejs/vine'

export const createStepValidator = vine.create({
  title: vine.string().maxLength(100),
  description: vine.string().maxLength(255).optional(),
  longitude: vine.number().decimal([1, 7]),
  latitude: vine.number().decimal([1, 7]),
  city: vine.string().maxLength(100),
  country: vine.string().maxLength(100),
  start_date: vine.date(),
  end_date: vine.date(),
  medias: vine.array(vine.file({ size: '4mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })).optional(),
  link: vine.string().url().optional(),
  travel_id: vine.string().uuid()
})
