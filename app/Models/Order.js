'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')
const numeral = require('numeral')

class Order extends Model {
    user() {
        return this.belongsTo('App/Models/User')
    }
    plan() {
        return this.belongsTo('App/Models/Plan')
    }
    event() {
        return this.hasOne('App/Models/Event')
    }
    getCreatedAt(date) {
        return moment.unix(date).locale('fa').format('MM/DD/YYYY');
    }

    static get createdAtColumn() {
        return 'created_at';
    }

   
    getPayments(price) {
        return numeral(price).format('0,0');
    }
    getDiscount(price) {
        return numeral(price).format('0,0');
    }
    getTotalPrice(price) {
        return numeral(price).format('0,0');
    }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
    
}

module.exports = Order
