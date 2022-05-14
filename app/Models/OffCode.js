'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const numeral = require('numeral')
const moment = require('jalali-moment')

class OffCode extends Model {
    static get table () {
        return 'off_code'
    }
    getPrice(price){
        return numeral(price).format('0,0');
    }
    static get createdAtColumn () {
        return 'created_at';
    }
    getCreatedAt(date){
        return moment.unix(date).locale('fa').format('MM/DD/YYYY');
    }
    getStart(date){
        return moment.unix(date).locale('fa').format('MM/DD/YYYY');
    }
    getEnd(date){
        return moment.unix(date).locale('fa').format('MM/DD/YYYY');
    }
    // getStatus(status){
    //     if(status == 1){
    //         return "فعال"
    //     }else{
    //         return "غیر فعال"
    //     }
    // }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
    
}

module.exports = OffCode
