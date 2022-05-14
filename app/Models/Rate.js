'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rate extends Model {
    static get traits () {
        return ['@provider:Morphable']
    }
    ratable () {
        return this.morphTo(['App/Models/Event'],'id','ratable_id','ratable_type')
    }
}

module.exports = Rate
