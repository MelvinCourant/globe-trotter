import { BaseMail } from '@adonisjs/mail'

export default class ForgottenPasswordNotification extends BaseMail {
  subject = 'Réinitialisez votre mot de passe - Globe Trotter'

  constructor(
    private userEmail: string,
    private url: string
  ) {
    super()
  }

  prepare() {
    this.message.to(this.userEmail).htmlView('emails/forgotten_password', {
      url: this.url,
    })
  }
}
