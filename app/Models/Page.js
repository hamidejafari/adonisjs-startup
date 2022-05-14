'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')

class Page extends Model {
    category () {
        return this.belongsTo('App/Models/PageCategory','category_id')
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

module.exports = Page
