'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ContentType extends Model {
    cotnents () {
        return this.hasMany('App/Models/Content','content_type_id','id').where('status',1).orderBy('id', 'desc')
    }
}

module.exports = ContentType
