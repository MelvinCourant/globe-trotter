import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'steps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('title', 100).notNullable()
      table.string('description', 300)
      table.decimal('longitude', 10, 7).notNullable()
      table.decimal('latitude', 10, 7).notNullable()
      table.string('place', 100).notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.uuid('medias')
      table.string('link')
      table.uuid('travel_id').references('id').inTable('travels').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
