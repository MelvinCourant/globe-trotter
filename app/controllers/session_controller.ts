import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import {randomUUID} from "node:crypto";

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)
    response.redirect().toRoute('home')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }

  async createShareLink({ auth, response }: HttpContext) {
    const user = await User.findOrFail(auth.user.id)

    user.shareLink = randomUUID()
    await user.save()

    response.status(200).send({
      shareLink: user.shareLink,
    })
  }
}
