import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { beforeCreate } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }
}
