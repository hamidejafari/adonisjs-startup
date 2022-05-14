'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')
class PageCategory extends Model {
    parent () {
        return this.belongsTo('App/Models/PageCategory','parent_id')
    }  
    childs () {
        return this.hasMany('App/Models/PageCategory','parent_id','id').orderBy('id', 'desc')
    }
    page () {
        return this.hasMany('App/Models/Page','category_id','id').orderBy('id', 'desc')
    }
    pageMenu () {
        return this.hasMany('App/Models/Page','category_id','id').where('status',1).where('show_menu',1).orderBy('id', 'desc')
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

module.exports = PageCategory
