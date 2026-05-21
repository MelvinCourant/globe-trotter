import type { HttpContext } from '@adonisjs/core/http'
import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import User from '#models/user'
import PasswordResetToken from '#models/password_reset_token'
import mail from '@adonisjs/mail/services/main'
import ForgottenPasswordNotification from '#mails/forgotten_password_notification'
import { forgottenPasswordValidator, resetPasswordValidator } from '#validators/user'
import env from '#start/env'

export default class PasswordResetController {
  async create({ inertia, session }: HttpContext) {
    return inertia.render('auth/forgotten-password', {
      sent: session.flashMessages.get('sent'),
      error: session.flashMessages.get('error'),
    })
  }

  async store({ request, response, session }: HttpContext) {
    const { email } = await request.validateUsing(forgottenPasswordValidator)

    const user = await User.findBy('email', email)

    if (user) {
      await PasswordResetToken.query().where('email', email).delete()

      const token = randomBytes(32).toString('hex')
      await PasswordResetToken.create({
        email,
        token,
        expiresAt: DateTime.now().plus({ hours: 1 }),
      })

      const url = `${env.get('APP_URL')}/reset-password/${token}`
      await mail.send(new ForgottenPasswordNotification(email, url))
    }

    session.flash('sent', true)
    return response.redirect().toRoute('forgotten_password.create')
  }

  async edit({ inertia, params, response, session }: HttpContext) {
    const tokenRecord = await PasswordResetToken.findBy('token', params.token)

    if (!tokenRecord || tokenRecord.expiresAt < DateTime.now()) {
      session.flash('error', 'Ce lien de réinitialisation est invalide ou a expiré.')
      return response.redirect().toRoute('forgotten_password.create')
    }

    return inertia.render('auth/reset-password', { token: params.token })
  }

  async update({ request, params, response, session }: HttpContext) {
    const tokenRecord = await PasswordResetToken.findBy('token', params.token)

    if (!tokenRecord || tokenRecord.expiresAt < DateTime.now()) {
      session.flash('error', 'Ce lien de réinitialisation est invalide ou a expiré.')
      return response.redirect().toRoute('forgotten_password.create')
    }

    const { password } = await request.validateUsing(resetPasswordValidator)

    const user = await User.findByOrFail('email', tokenRecord.email)
    user.password = password
    await user.save()

    await tokenRecord.delete()

    return response.redirect().toRoute('session.create')
  }
}
