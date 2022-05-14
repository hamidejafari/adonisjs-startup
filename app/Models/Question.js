'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')

class Question extends Model {
    category () {
        return this.belongsTo('App/Models/QuestionCategory','category_id')
    }  
    static scopeActive (query) {
        return query.where('status',1)
    }
    static scopeVisit(query) {
        return query.where('show_first',1)
    }
    static scopeLike(query) {
        return query.where('show_menu',1)
    }
    static scopeNew(query) {
        return query.where('show_side',1)
    }
    getCreatedAt(date){
        return moment.unix(date).locale('fa').format('MM/DD/YYYY HH:mm')
    }
    tag () {
        return this.belongsToMany('App/Models/Tag')
        .pivotModel('App/Models/QuestionTag')
    }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
    
}

module.exports = Question
