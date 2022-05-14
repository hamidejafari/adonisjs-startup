'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ArticleLike extends Model {
    static get table () {
        return 'article_like'
    }
}

module.exports = ArticleLike
