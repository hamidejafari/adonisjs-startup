'use strict'

const Model = use('Model')

class Conversation extends Model {

    static get createdAtColumn () {
        return null
      }
     
      static get updatedAtColumn () {
        return null
      }
}

module.exports = Conversation