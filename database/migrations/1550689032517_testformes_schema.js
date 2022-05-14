'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TestformesSchema extends Schema {
  async up() {
    const exists = await this.hasTable('testformes')
    if (!exists) {
      this.createIfNotExists('testformes', (table) => {
        table.increments()
        table.timestamps()
      })
    }
  }

  down() {
    this.drop('testformes')
  }
}

module.exports = TestformesSchema
