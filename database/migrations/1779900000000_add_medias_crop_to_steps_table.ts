import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'steps'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.jsonb('medias_crop').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('medias_crop')
    })
  }
}
