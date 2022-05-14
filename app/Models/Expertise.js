'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')

class Expertise extends Model {
    parent() {
        return this.hasOne('App/Models/Expertise','parent_id','id')
    } 
    childs() {
        return this.hasMany('App/Models/Expertise','parent_id')
    }
    field() {
        return this.belongsToMany('App/Models/Field')
    }
    users () {
        return this
        .belongsToMany('App/Models/User')
        .pivotTable('expertise_user')
    }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
    
}

module.exports = Expertise
