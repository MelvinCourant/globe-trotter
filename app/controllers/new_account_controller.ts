import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import { convertHeicToJpg } from '#services/media_converter'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(signupValidator)
    let imagePath: string | null = null

    if (payload.image) {
      await convertHeicToJpg(payload.image)
      imagePath = `${randomUUID()}.${payload.image.extname}`

      await payload.image.moveToDisk(imagePath)
    }

    const user = await User.create({ ...payload, image: imagePath })

    await auth.use('web').login(user)
    response.redirect().toRoute('home')
  }
}
