'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class MessageSource extends Model {
    static get table () {
        return 'message_source'
    }
}

module.exports = MessageSource
