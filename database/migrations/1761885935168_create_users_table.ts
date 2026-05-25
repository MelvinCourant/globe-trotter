import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('firstname', 25).notNullable()
      table.string('lastname', 50).nullable()
      table.string('image').nullable()
      table.uuid('share_link').nullable()
      table.enum('theme', ['system', 'light', 'dark', 'auto']).defaultTo('auto')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
