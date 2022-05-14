'use strict'
const Event = use('App/Models/Event')
const User = use('App/Models/User')
const Order = use('App/Models/Order')
const Expertise = use('App/Models/Expertise')
const State = use('App/Models/State')
const City = use('App/Models/City')
const axios = require('axios')
const moment = require('jalali-moment')

class EventController {
    async list({ view , request}) {
		const userId = request.get().user_id || null;
        const page = request.get().page || 1;
        let cityUserIds = null;
        let cityAdviserIds = null;

        if(request.all().city_adviser){
            cityAdviserIds = await User.query().where('city_id',request.all().city_adviser).pluck('id')
        }
        if(request.all().city_user){
            cityUserIds = await User.query().where('city_id',request.all().city_user).pluck('id')
        }
        
        const events = await Event.query().where(function () {
			//From & Until Date
            if(request.all().formDate && request.all().untilDate){
                let fromDate = moment(request.all().formDate, 'jYYYY/jM/jD/').format('MM/DD/YYYY HH:mm')
                let untilDate = moment(request.all().untilDate, 'jYYYY/jM/jD/').format('MM/DD/YYYY HH:mm')
                let finalFromDate = moment(fromDate).add('days', 1).format('YYYY/MM/DD HH:mm');
                let finalUntilDate = moment(untilDate).add('days', 1).format('YYYY/MM/DD HH:mm');
                this.whereBetween('created_at',[finalFromDate,finalUntilDate])
            }

            if(cityAdviserIds){
                this.whereIn('user_id',cityAdviserIds)
            }
            if(cityUserIds){
                this.whereIn('reserved_id',cityUserIds)
            }
            
            if(request.all().user_id){
                this.where('user_id',request.all().user_id)
            }
            if(request.all().checkout_id){
                this.where('checkout_id',request.all().checkout_id)
            }
            if(request.all().expertise_id){
                this.where('expertise_id',request.all().expertise_id)
            }  
            if(request.all().type){
                if(request.all().type == 'all'){
                    this.whereIn('event_type_id',[100,120,110,0]).whereNotNull('reserved_id')
                }
                if(request.all().type == 'done'){
                    this.whereIn('event_type_id',[100,120,110]).whereNotNull('reserved_id')
                }
                if(request.all().type == 'resrved'){
                    this.whereIn('event_type_id',[0]).whereNotNull('reserved_id')
                }
            }else{
                this.whereIn('event_type_id',[100,120,110,0]).whereNotNull('reserved_id')
            }
        }).with('user').orderBy('id', 'desc').paginate(page,30);
        const expertises = await Expertise.query().where('type',1).orderBy('id', 'desc').fetch();
        const timeNow =  moment().locale('fa').format('MM/DD/YYYY HH:mm');
        const finalEvents = events.toJSON();
        await  Promise.all(finalEvents.data.map(async item => {
            item.reserved = item.reserved_id !== null ? await User.find(item.reserved_id) : null;
        }));
        //States
        const states  = await State.all()
        return view.render('admin.event.list',{
            events: finalEvents,
            countEvents: finalEvents.total,
            states  : states.toJSON(),
            expertises: expertises.toJSON(),
            timeNow: timeNow,
            userId : userId
        });
    }
    async allow({ response,params }){ 
        const event = await Event.find(params.id)
        event.allow_past_chat = !event.allow_past_chat  
        await event.save()
        return response.redirect('back') 
    }
    async reserved({ response,params }){
        const timeNow =  moment().locale('fa').format('MM/DD/YYYY HH:mm');
        const event = await Event.query().whereNotNull('reserved_id').where('end','>=',timeNow).where('id',params.id).first()
        const userReserve = await User.find(event.reserved_id)
        const order = await Order.query().where('plan_id',3).where('id',event.order_id).first()
        if(order){
            const paySave = order.total_price
            const payments = paySave
            const discount = 0 
            await Order.create({
                'user_id' : userReserve.id,
                'total_price' : paySave,
                'payments' : payments,
                'discount' : discount,
                'plan_id' : 4,
                'quantity' : 1,
                'status' : 1,
                'description' : "کنسل کردن رزرو از طریق پنل مدیریت"
        })
            const newWallet = userReserve.wallet +  (order.total_price * (-1)) - (paySave * (-1)) 
            userReserve.wallet = newWallet
            await userReserve.save()
            await order.delete()
        }

        event.order_id = null
        event.color = "#3a87ad"
        event.reserved_id = null
        await event.save()
        return response.redirect('back') 
    }

}


module.exports = EventController
