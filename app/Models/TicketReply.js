'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')

class TicketReply extends Model {
    static get table () {
        return 'ticket_reply'
    }
     user() {
        return this.belongsTo('App/Models/User')
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

module.exports = TicketReply
