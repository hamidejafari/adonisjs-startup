'use strict'
const Ticket = use('App/Models/Ticket')
const TicketReply = use('App/Models/TicketReply')
const Department = use('App/Models/Department')
const User = use('App/Models/User')

class TicketController {
    async list({ view ,request }){
        const tickets = await Ticket.query().where(function () {
            if(request.all()){
                
                if(request.all().department_id && request.all().department_id != 'all'){
                    console.log(request.all().department_id)
                    if(request.all().department_id == 0){
                        console.log('hhaaa')
                        this.where('message',1)
                    }else{
                        this.where('department_id',request.all().department_id)
                    }
                }
                if(request.all().status && request.all().status != 'all'){
                    this.where('status',request.all().status)
                }
                if(request.all().user_id){
                    this.where('user_id',request.all().user_id)
                }
                if(request.all().title){
                    this.where('title', 'LIKE', '%'+request.all().title+'%')
                }
            }
        }).with('user').with('department').orderBy('id', 'desc').fetch()
        const department = await Department.all()
        return view.render('admin.ticket.list',{
            tickets  : tickets.toJSON(),
            department  : department.toJSON()
        })
    }
   
    async close({ params, response }){
        const ticket = await Ticket.find(params.id)
        ticket.status  = 2
        await ticket.save()
        return response.redirect('back') 
    }
      
    
    async newTicket({ params, view }){
        const user = await User.find(params.id)
        return view.render('admin.ticket.new-ticket',{
            user : user
        })
    }

    async saveNewTicket({ request , response }){
        await Ticket.create({
            user_id : request.all().user_id,
            message : 1,
            department_id : 6,
            content : request.all().content
        })
        return response.redirect('/admin/ticket/list');
    }

    async saveNewTicketAdviser({ request , response }){
        let sub = '  ارسال پیام از مدیریت : ' + request.all().title 
        await Ticket.create({
            user_id : request.all().user_id,
            message : 1,
            department_id : 6,
            title : sub,
            content : request.all().content
        })
        return response.redirect('back');
    }

    async reply({ params, view }){
        const ticket = await Ticket.query().where('id',params.id).with('replies').with('user').first()
        return view.render('admin.ticket.reply',{
            ticket  : ticket.toJSON(),
        })
    }

    async postReply({ response,request,auth }){
        const ticket = await Ticket.find(request.all().ticket_id)

        await Ticket.create({
            parent_id : request.all().ticket_id,
            user_id : auth.user.id,
            content : request.all().message
        })
        ticket.status  = 1 
        await ticket.save()
        return response.redirect('back');

        
    }
    async destroy({ request ,response }){
        const tickets = await TicketReply.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }

}

module.exports = TicketController
