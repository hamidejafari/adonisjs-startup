'use strict'
const Message = use('App/Models/Message')
const User = use('App/Models/User')

class MessageController {
    async chatView({ view , params , response , session}){
        const messages = await Message.query().where('event_id',params.id).with('user').with('messageSource').with('event').fetch();
        const msg = await Message.query().where('event_id',params.id).with('messageSource').first()
        const countMessages = await Message.query().where('event_id',params.id).with('user','messageSource','messageType').count();
        // return response.redirect('/admin/event/list')
        if(!msg){
            session.flash({errorEvent: 'هیچ گفتگویی وجود ندارد'})
            return response.route('event.list')
        }
        return view.render('admin.message.chat-view',{
            messages  : messages.toJSON(),
            msg : msg.toJSON(),
            countMessages : countMessages[0]['count(*)']
        });
    }
}

module.exports = MessageController
