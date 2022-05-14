'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')

class Ticket extends Model {
    static get table () {
        return 'ticket'
    }
    user() {
        return this.belongsTo('App/Models/User')
    }
    replies() {
        return this.hasMany('App/Models/Ticket','id','parent_id').with('user')
    }
    department() {
        return this.belongsTo('App/Models/Department')
    }
    getCreatedAt(date){
        return moment.unix(date).locale('fa').format('MM/DD/YYYY');
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

module.exports = Ticket
