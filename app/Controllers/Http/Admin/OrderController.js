'use strict'
const Order = use('App/Models/Order')
const Plan = use('App/Models/Plan')
const moment = require('jalali-moment')
const Event = use('App/Models/Event')

class OrderController {
    async list({ view  , request}) {
        const page = request.get().page || 1;
        let orderIds = null;
        if(request.all().checkout_id){
            orderIds = await Event.query().where('checkout_id',request.all().checkout_id).pluck('checkout_order_id')
        }
        const orders = await Order.query().where(function () {
            if(request.all()){
                if(request.all().user_id){
                    this.where('user_id',request.all().user_id)
                }     
                if(request.all().checkout_id){
                    this.whereIn('id',orderIds)
                }
                if(request.all().order_id){
                    this.where('id',request.all().order_id)
                }
                if(request.all().tracking_code){
                    this.where('tracking_code',request.all().tracking_code)
                }
                if(request.all().payments){
                    this.where('payments',request.all().payments)
                }
                if(request.all().plan_id && request.all().plan_id != "all"){
                    this.where('plan_id',request.all().plan_id)
                }  
                if(request.all().status && request.all().status != "all"){
                    this.where('status',request.all().status)
                }         
                if(request.all().day && request.all().year && request.all().month){
                    let dateJalali = request.all().year + '/' + request.all().day +  '/' +   request.all().month     
                    let date = moment(dateJalali, 'jYYYY/jM/jD/').format('YYYY-M-D')
                    let lastDate =  moment(date).unix()
                    this.where('created_at',lastDate)
                }        
            }
        })
        .with('user', (builder) => {
            if(request.all().name){
                builder.where('name', 'LIKE', '%'+request.all().name+'%')
            }
            if(request.all().family){
                builder.where('family', 'LIKE', '%'+request.all().family+'%')
            }
        })
        .with('plan')
        .orderBy('id', 'desc')
        .paginate(page,15)


        const plans = await Plan.query().fetch()
        return view.render('admin.orders.list',{
            orders: orders.toJSON(),
            plans: plans.toJSON()
        });
    }
    async detail({ params,view }) {
        const order = await Order.query().with('user').with('plan').where('id',params.id).first();
        return view.render('admin.orders.detail',{
            order:  order.toJSON()
        });
    }
    
}

module.exports = OrderController
