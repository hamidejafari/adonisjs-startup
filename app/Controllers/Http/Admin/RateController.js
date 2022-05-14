'use strict'
const Event = use('App/Models/Event')
const User = use('App/Models/User')
const Rate = use('App/Models/Rate')

var _ = require('lodash');
class RateController {
    async list({ view,params }){
        // const user = await User.query().where('id',params.id).with('rates').fetch();
        const rates = await Rate.query().where('user_id',params.id).fetch();   
        return view.render('admin.rates.list',{
            rates  : rates.toJSON()
        });
    }
}

module.exports = RateController
