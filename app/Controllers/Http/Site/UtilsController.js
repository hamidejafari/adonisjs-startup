'use strict'
const User = use('App/Models/User')
const Conversation = use('App/Models/Conversation')
const Issue = use('App/Models/Issue')

class UtilsController {
    async openAppTest({ view  }) {
        return view.render('site.payment-final');
    }
    async createConversations({ request, response }) {
        const issues = await Issue.all();
        //console.log(issues.rows.length);
        for (let index = 0; index < issues.rows.length; index++) {
            let sender = await User.find(issues.rows[index].sender_id);
            let receiver = await User.find(issues.rows[index].receiver_id);
            if (sender && receiver) {
                let userId = sender.user_type_id === 1 ? sender.id : receiver.id;
                let advisorId = sender.user_type_id > 1 ? sender.id : receiver.id;
                //console.log(userId)
                //console.log(advisorId)
                let conversation = await Conversation.query()
                    .where('user_id', '=', userId).where('advisor_id', '=', advisorId).first()
                if (!conversation) {
                    conversation = new Conversation()
                    conversation.user_id = userId
                    conversation.advisor_id = advisorId
                    conversation.user_is_read = 1
                    conversation.advisor_is_read = 1
                    conversation.created_at = issues.rows[index].created_at
                    conversation.updated_at = issues.rows[index].created_at
                    await conversation.save()
                } else {
                    console.log(issues.rows[index].created_at);
                    conversation.created_at = issues.rows[index].created_at
                    conversation.updated_at = issues.rows[index].created_at
                    await conversation.save()
                }

                
                await Issue
                    .query()
                    .where('sender_id', sender.id)
                    .where('receiver_id', receiver.id)
                    .update({ conversation_id: conversation.id });
                
                    await Issue
                    .query()
                    .where('sender_id', receiver.id)
                    .where('receiver_id', sender.id)
                    .update({ conversation_id: conversation.id });
                console.log(conversation.id)
                
            }
        }
    }
}

module.exports = UtilsController