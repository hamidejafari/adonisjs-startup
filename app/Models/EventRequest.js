'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')

class EventRequest extends Model {
    static boot () {
        super.boot()

        this.addTrait('@provider:Lucid/SoftDeletes')
    }

    static get table () {
        return 'event_requests'
    }
    user() {
        return this.belongsTo('App/Models/User')
    }
    approved() {
        return this.belongsTo('App/Models/User','approved_user_id','id')
    }
    event() {
        return this.belongsTo('App/Models/Event')
    }
    expertise() {
        return this.belongsTo('App/Models/Expertise')
    }
    getApproveDate(date){
        if(date == null){
            return null;
        }
        return moment(date).locale('fa').format('MM/DD/YYYY HH:mm');
    }

}

module.exports = EventRequest
