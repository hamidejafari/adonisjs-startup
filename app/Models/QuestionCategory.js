'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')
const Drive = use('Drive')
const Helpers = use('Helpers')

class QuestionCategory extends Model {
    parent () {
        return this.belongsTo('App/Models/QuestionCategory','parent_id')
    }  
    childs () {
        return this.hasMany('App/Models/QuestionCategory','parent_id','id').orderBy('id', 'desc')
    }
    cotnents () {
        return this.hasMany('App/Models/Question','category_id','id').orderBy('id', 'desc')
    }
    static scopeActive (query) {
        return query.where('status',1)
    }
    static get createdAtColumn () {
        return 'created_at'
    }
    getCreatedAt(date){
        return moment.unix(date).locale('fa').format('MM/DD/YYYY HH:mm')
    }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
    
}

module.exports = QuestionCategory
