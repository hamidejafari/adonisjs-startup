'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LikesSchema extends Schema {
  async up() {
    const exists = await this.hasTable('likes')
    if (!exists) {
      this.createIfNotExists('likes', (table) => {
        table.increments()
        table.integer('like_value')
        table.integer('user_id').index()
        table.integer('likable_id').index()
        table.string('likable_type').index()
        table.timestamps()
      })
    }
  }

  down() {
    this.drop('likes')
  }
}

module.exports = LikesSchema
