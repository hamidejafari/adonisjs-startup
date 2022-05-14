'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')
const Drive = use('Drive')
const Helpers = use('Helpers')
class Article extends Model {
    likes () {
        return this.hasMany('App/Models/ArticleLike','id','article_id')
    }
    category () {
        return this.belongsTo('App/Models/ArticleCategory','category_id')
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

module.exports = Article
