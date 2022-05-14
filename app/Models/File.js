'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')

class File extends Model {
    user () {
        return this.belongsTo('App/Models/User','user_id')
    }
    recordType () {
        return this.belongsTo('App/Models/RecordType','record_type_id')
    }  
    admin () {
        return this.belongsTo('App/Models/User','admin_id')
    }  
    static scopeActive (query) {
        return query.where('status',1)
    }
    getExtantion(rate){
        return Math.floor(rate)
    }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
}

module.exports = File
