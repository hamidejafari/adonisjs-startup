'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TokensSchema extends Schema {
  async up() {
    const exists = await this.hasTable('tokens')
    if (!exists) {
      this.create('tokens', (table) => {
        table.increments()
        table.integer('user_id').unsigned().references('id').inTable('users')
        table.string('token', 255).notNullable().unique().index()
        table.string('type', 80).notNullable()
        table.boolean('is_revoked').defaultTo(false)
        table.timestamps()
      })
    }
  }

  down() {
    this.drop('tokens')
  }
}

module.exports = TokensSchema
