'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('jalali-moment')
const Drive = use('Drive')
const Helpers = use('Helpers')

class Content extends Model {
    contentType () {
        return this.belongsTo('App/Models/ContentType','content_type_id')
    }  
    getCreatedAt(date){
        return moment.unix(date).locale('fa').format('MM/DD/YYYY HH:mm');
    }
    setUpdatedAt() {
        return moment().unix()
    }
    setCreatedAt() {
        return moment().unix()
    }
    
    // getImage(image){
    //     const exists =   Drive.exists(Helpers.publicPath('asset/admin/uploads/news/medium/'+image))
    //     if(exists){
    //         return 'asset/admin/uploads/news/medium/'+image;
    //     }else{
    //         return 'default.jpg';
    //     }
    // }
    static scopeActive (query) {
        return query.where('status',1)
    }
    static scopeSlider (query) {
        return query.where('content_type_id',1)
    }
    static scopeNews (query) {
        return query.where('content_type_id',2)
    }
    static scopeSocial (query) {
        return query.where('content_type_id',3)
    }
    static scopeMultiMedia (query) {
        return query.where('content_type_id',4)
    }
    static get createdAtColumn () {
        return 'created_at';
    }
   
}

module.exports = Content
