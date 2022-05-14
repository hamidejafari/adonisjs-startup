'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')

class Record extends Model {
    getCreatedAt(date){
        return moment.unix(date).locale('fa').format('MM/DD/YYYY MM:mm');
    }
    user() {
        return this.belongsTo('App/Models/User')
    }
    recordType() {
        return this.belongsTo('App/Models/RecordType','type', 'id')
    }
    static get createdAtColumn () {
        return 'created_at';
    }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
    
}

module.exports = Record
