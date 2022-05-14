'use strict'
const EventRequest = use('App/Models/EventRequest')
const Expertise = use('App/Models/Expertise')

class EventRequestController {
    async list({ view , request }) {
        const page = request.get().page || 1;
        const eventRequests = await EventRequest.query().where(function () {
            if(request.all()){
                console.log(request.all().reserved)
                if(request.all().user_id){
                    this.where('user_id',request.all().user_id)
                }
                if(request.all().approved_user_id){
                    this.where('approved_user_id',request.all().approved_user_id)
                }
                if(request.all().event_id){
                    this.where('event_id',request.all().event_id)
                }
                if(request.all().expertise_id != 0 && request.all().expertise_id != null){
                    this.where('expertise_id',request.all().expertise_id)
                }
                if(request.all().status == 'reserved'){
                    this.whereNotNull('approved_user_id')
                }
                if(request.all().status == 'notReserved'){
                    this.where('approved_user_id',null)
                }
                if(request.all().status == 'both'){
                }
            }
        }).with('user').with('expertise').with('approved').orderBy('id', 'desc').paginate(page,15);
        const expertise = await Expertise.all()
        return view.render('admin.event-request.list',{
            eventRequests: eventRequests.toJSON(),
            expertise: expertise.toJSON()
        });
    }
    async delete({ params , response }) {
        const eventRequest = await EventRequest.find(params.id)
        await eventRequest.delete()
        
        return response.redirect('back') 
    }
    async destroy({request,response}){
        const eventRequest = await  EventRequest.query().whereIn('id',request.all().deletedId).delete()
        return response.redirect('back');
    }
}

module.exports = EventRequestController
