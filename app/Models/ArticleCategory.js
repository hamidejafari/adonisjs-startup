'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')
const Drive = use('Drive')
const Helpers = use('Helpers')
class ArticleCategory extends Model {
    parent () {
        return this.belongsTo('App/Models/ArticleCategory','parent_id')
    }  
    childs () {
        return this.hasMany('App/Models/ArticleCategory','parent_id','id').orderBy('id', 'desc')
    }
    article () {
        return this.hasMany('App/Models/Article','category_id','id').orderBy('id', 'desc')
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

module.exports = ArticleCategory
