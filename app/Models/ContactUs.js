'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')

class ContactUs extends Model {
    static get table () {
        return 'contact_us'
    }
    getCreatedAt(date){
        return moment(date).locale('fa').format('MM/DD/YYYY HH:mm')
    }
    static get createdAtColumn () {
        return 'created_at'
    }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
    
}

module.exports = ContactUs
