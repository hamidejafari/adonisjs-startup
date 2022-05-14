'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')

class Message extends Model {
    
    user(){
        return this.belongsTo('App/Models/User', 'user_id');
    }
    event(){
        return this.belongsTo('App/Models/Event', 'event_id');
    }
    messageSource(){
        return this.belongsTo('App/Models/MessageSource', 'message_source_id');
    }
    messageType(){
        return this.belongsTo('App/Models/MessageType', 'message_type_id');
    }
    getCreatedAt(date){
        return moment(date).locale('fa').format('MM/DD/YYYY HH:mm');

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

module.exports = Message
