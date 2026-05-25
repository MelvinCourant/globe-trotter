import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import {randomUUID} from "node:crypto";
import {updateProfilePictureValidator, updateThemeValidator} from "#validators/user";
import drive from '@adonisjs/drive/services/main'
import {convertHeicToJpg} from "#services/media_converter";

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, response, auth }: HttpContext) {
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
    const user = await User.findOrFail(auth.user!.id)

    user.shareLink = randomUUID()
    await user.save()

    response.status(200).send({
      shareLink: user.shareLink,
    })
  }

  async updateTheme({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updateThemeValidator)
    const user = await User.findOrFail(auth.user!.id)

    user.theme = payload.theme
    await user.save()

    response.redirect().back()
  }

  async updateProfilePicture({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(updateProfilePictureValidator)
    const user = await User.findOrFail(auth.user!.id)
    const disk = drive.use()

    if (user.image) {
      await disk.delete(user.image)
    }

    let imagePath: string | null = null

    await convertHeicToJpg(payload.image)
    imagePath = `${randomUUID()}.${payload.image.extname}`

    await payload.image.moveToDisk(imagePath)
    user.image = imagePath
    await user.save()

    response.redirect().back()
  }
}
