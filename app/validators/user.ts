import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

export const forgottenPasswordValidator = vine.create(
  vine.object({ email: email() })
)

export const resetPasswordValidator = vine.create(
  vine.object({
    password: password().confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)

export const signupValidator = vine.create({
  email: email().unique({ table: 'users', column: 'email' }),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
  firstname: vine.string().maxLength(25),
  lastname: vine.string().maxLength(50).optional().nullable(),
  image: vine.file({
    size: '4mb',
    extnames: ['jpg', 'png', 'jpeg', 'webp']
  }).optional().nullable(),
})
