import vine from '@vinejs/vine'

export const createTravelValidator = vine.create({
  title: vine.string().maxLength(50),
})