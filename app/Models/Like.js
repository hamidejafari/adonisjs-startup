'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Like extends Model {
    static get traits () {
        return ['@provider:Morphable']
    }
    likable () {
        return this.morphTo(['App/Models/User','App/Models/Article'],'id','id','likable_id','likable_type')
    }
}

module.exports = Like
