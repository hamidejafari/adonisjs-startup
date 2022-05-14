'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')
const numeral = require('numeral')

class Transaction extends Model {
    static get table () {
        return 'gateway_transactions'
    }
    user () {   
        return this.belongsTo('App/Models/User')
    }  
    order () {
        return this.belongsTo('App/Models/Order')
    }  
    static get createdAtColumn () {
        return 'created_at'
    }
    getCreatedAt(date){
        return moment(date).locale('fa').format('MM/DD/YYYY');        
    }
    getPrice(price){
        return numeral(price).format('0,0');
    }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
    
}

module.exports = Transaction
