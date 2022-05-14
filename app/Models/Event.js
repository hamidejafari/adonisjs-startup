'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')
const numeral = require('numeral')
class Event extends Model {
    static get traits () {
        return ['@provider:Morphable']
    }
    rates () {
        return this.morphMany('App/Models/Rate', 'id', 'ratable_id', 'ratable_type')
    }
    user() {
        return this.belongsTo('App/Models/User', 'user_id', 'id')
    }
    reserved() {
        return this.belongsTo('App/Models/User' , 'reserved_id', 'id')
    }
    getStart(date){
        return moment(date).locale('fa').format('HH:mm YYYY/MM/DD');
    } 
    getEnd(date){
        if(date == null){
            return 'بدون تاریخ';
        }
        return moment(date).locale('fa').format('HH:mm YYYY/MM/DD');
    }
}
module.exports = Event
