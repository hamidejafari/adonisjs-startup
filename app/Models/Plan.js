'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const numeral = require('numeral')
const moment = require('jalali-moment')

class Plan extends Model {
    static boot () {
        super.boot()
        this.addTrait('@provider:Lucid/SoftDeletes')
    }
    getCreatedAt(date){
        if(date){
            return moment.unix(date).locale('fa').format('MM/DD/YYYY HH:mm')
        }else{
            return ''
        }
    }
    getStartDate(date){
        if(date){
            return moment.unix(date).locale('fa').format('MM/DD/YYYY HH:mm')
        }else{
            return ''
        }
    }
    getEndDate(date){
        if(date){
            return moment.unix(date).locale('fa').format('MM/DD/YYYY HH:mm')
        }else{
            return ''
        }
    }
    getDay(day){
        if(day){
            return day
        }else{
            return ''
        }
    }
    getPrice(price){
        if(price){
            return numeral(price).format('0,0');
        }else{
            return ''
        }
    }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
    
}

module.exports = Plan
