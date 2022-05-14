'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')
class Redirect extends Model {
    static get createdAtColumn () {
        return 'created_at'
    }
    getCreatedAt(date){
        return moment(date).locale('fa').format('HH:mm YYYY/MM/DD');
    }
}
module.exports = Redirect